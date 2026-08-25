import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const repositoryRootUrl = pathToFileURL(`${repositoryRoot}${path.sep}`).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      context.parentURL?.startsWith(repositoryRootUrl) &&
      !context.parentURL.includes('/node_modules/') &&
      specifier.startsWith('.') &&
      path.extname(specifier) === '.js'
    ) {
      return nextResolve(`${specifier.slice(0, -3)}.ts`, context);
    }

    return nextResolve(specifier, context);
  },
});

const middlewareUrl = pathToFileURL(path.join(repositoryRoot, 'middleware.ts'));
const loginFunctionUrl = pathToFileURL(
  path.join(repositoryRoot, 'api/auth/login.ts'),
);
const { default: middleware } = await import(middlewareUrl.href);
const { default: login } = await import(loginFunctionUrl.href);
const productionOrigin = 'https://demo.example';
const testPassword = 'sales-demo-password-2026';
const testSessionSecret = '0123456789abcdef0123456789abcdef0123456789abcdef';
let assertionCount = 0;

function expect(condition, message) {
  assertionCount += 1;
  assert.ok(condition, message);
}

function configure(password = testPassword, secret = testSessionSecret) {
  process.env.WINWORK_ACCESS_PASSWORD = password;
  process.env.WINWORK_SESSION_SECRET = secret;
}

function makeRequest(pathname, init = {}, origin = productionOrigin) {
  return new Request(`${origin}${pathname}`, init);
}

async function submitLogin({ password, returnTo, origin = productionOrigin }) {
  return login(
    makeRequest(
      '/api/auth/login',
      {
        body: new URLSearchParams({ password, returnTo }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
      },
      origin,
    ),
  );
}

delete process.env.WINWORK_ACCESS_PASSWORD;
delete process.env.WINWORK_SESSION_SECRET;

const missingConfig = await middleware(
  makeRequest('/enterprise', { headers: { Accept: 'text/html' } }),
);
expect(missingConfig.status === 503, 'Missing config must fail closed');

configure();

const returnTo = '/enterprise?scene=ent-04&source=sales';
const unauthorizedPage = await middleware(
  makeRequest(returnTo, { headers: { Accept: 'text/html' } }),
);
const unauthorizedHtml = await unauthorizedPage.text();
expect(unauthorizedPage.status === 401, 'Navigation must require login');
expect(
  unauthorizedHtml.includes(
    'value="/enterprise?scene=ent-04&amp;source=sales"',
  ),
  'Login page must preserve and escape the deep link',
);
expect(
  !unauthorizedHtml.includes(testPassword) &&
    !unauthorizedHtml.includes(testSessionSecret),
  'Login HTML must not expose secrets',
);

const unauthorizedAsset = await middleware(
  makeRequest('/enterprise-slides/ent-04-objects.png', {
    headers: { Accept: 'image/png' },
  }),
);
expect(unauthorizedAsset.status === 401, 'Direct assets must be protected');

const wrongLogin = await submitLogin({
  password: 'wrong-password',
  returnTo,
});
expect(wrongLogin.status === 303, 'Wrong password must return to the form');
expect(
  wrongLogin.headers.get('set-cookie') === null,
  'Wrong password must not set a session',
);
const wrongLocation = wrongLogin.headers.get('location') ?? '';
expect(
  wrongLocation.startsWith('/auth/login?'),
  'Wrong password must redirect to the public login page',
);
const wrongPasswordPage = await middleware(
  makeRequest(wrongLocation, { headers: { Accept: 'text/html' } }),
);
expect(
  (await wrongPasswordPage.text()).includes('Неверный пароль.'),
  'Redirected login page must show the generic error',
);

const loginPassThrough = await middleware(
  makeRequest('/api/auth/login', { method: 'POST' }),
);
expect(
  loginPassThrough.headers.get('x-middleware-next') === '1',
  'Middleware must pass the login body to the Vercel Function untouched',
);

const correctLogin = await submitLogin({
  password: testPassword,
  returnTo,
});
const setCookie = correctLogin.headers.get('set-cookie') ?? '';
const cookiePair = setCookie.split(';', 1)[0] ?? '';
expect(correctLogin.status === 303, 'Correct password must redirect');
expect(
  correctLogin.headers.get('location') === returnTo,
  'Correct password must restore the deep link',
);
expect(
  setCookie.startsWith('__Host-winwork_demo_session='),
  'HTTPS must use a host-only cookie name',
);
expect(
  setCookie.includes('Max-Age=2592000') &&
    setCookie.includes('HttpOnly') &&
    setCookie.includes('SameSite=Lax') &&
    setCookie.includes('Secure'),
  'Session cookie must have all security and lifetime attributes',
);

const authenticatedAsset = await middleware(
  makeRequest('/enterprise-slides/ent-04.html', {
    headers: { Cookie: cookiePair },
  }),
);
expect(
  authenticatedAsset.headers.get('x-middleware-next') === '1',
  'Valid cookie must continue to the protected asset',
);

const [tamperedCookieName, tamperedToken = ''] = cookiePair.split('=', 2);
const tamperedTokenParts = tamperedToken.split('.');
const signature = tamperedTokenParts[2] ?? '';
tamperedTokenParts[2] = `${signature.startsWith('a') ? 'b' : 'a'}${signature.slice(1)}`;
const tamperedCookie = `${tamperedCookieName}=${tamperedTokenParts.join('.')}`;
const tamperedRequest = await middleware(
  makeRequest('/', {
    headers: { Accept: 'text/html', Cookie: tamperedCookie },
  }),
);
expect(tamperedRequest.status === 401, 'Tampered cookie must be rejected');

configure('rotated-sales-password-2026');
const rotatedPasswordRequest = await middleware(
  makeRequest('/', {
    headers: { Accept: 'text/html', Cookie: cookiePair },
  }),
);
expect(
  rotatedPasswordRequest.status === 401,
  'Password rotation must invalidate existing cookies',
);

configure();
const realNow = Date.now;
Date.now = () => realNow() + 31 * 24 * 60 * 60 * 1_000;
const expiredRequest = await middleware(
  makeRequest('/', {
    headers: { Accept: 'text/html', Cookie: cookiePair },
  }),
);
Date.now = realNow;
expect(expiredRequest.status === 401, 'Expired cookie must be rejected');

const openRedirectAttempt = await submitLogin({
  password: testPassword,
  returnTo: 'https://evil.example/steal',
});
expect(
  openRedirectAttempt.headers.get('location') === '/',
  'External returnTo must be normalized to the root',
);

const logout = await middleware(
  makeRequest('/auth/logout', {
    headers: { Cookie: cookiePair },
    method: 'POST',
  }),
);
expect(logout.status === 303, 'Logout must redirect');
expect(
  (logout.headers.get('set-cookie') ?? '').includes('Max-Age=0'),
  'Logout must clear the session cookie',
);

const localLogin = await submitLogin({
  origin: 'http://127.0.0.1:3000',
  password: testPassword,
  returnTo: '/',
});
const localCookie = localLogin.headers.get('set-cookie') ?? '';
expect(
  localCookie.startsWith('winwork_demo_session='),
  'Local HTTP must use the development cookie name',
);
expect(
  !localCookie.includes('; Secure'),
  'Local HTTP cookie must remain usable through vercel dev',
);

configure(testPassword, 'too-short');
const weakConfig = await middleware(
  makeRequest('/', { headers: { Accept: 'text/html' } }),
);
expect(weakConfig.status === 503, 'Weak signing secret must fail closed');

console.log(`Auth gateway valid: ${assertionCount} assertions.`);
