const ACCESS_PASSWORD_ENV = 'WINWORK_ACCESS_PASSWORD';
const SESSION_SECRET_ENV = 'WINWORK_SESSION_SECRET';
const PRODUCTION_COOKIE_NAME = '__Host-winwork_demo_session';
const LOCAL_COOKIE_NAME = 'winwork_demo_session';
const SESSION_VERSION = 'v1';
const MIN_PASSWORD_LENGTH = 12;
const MIN_SESSION_SECRET_LENGTH = 32;
const encoder = new TextEncoder();

export const LOGIN_PAGE_PATH = '/auth/login';
export const LOGIN_API_PATH = '/api/auth/login';
export const LOGOUT_PATH = '/auth/logout';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type AuthConfig = {
  accessPassword: string;
  sessionSecret: string;
};

export function readAuthConfig(): AuthConfig | null {
  const accessPassword = process.env[ACCESS_PASSWORD_ENV] ?? '';
  const sessionSecret = process.env[SESSION_SECRET_ENV] ?? '';

  if (
    accessPassword.length < MIN_PASSWORD_LENGTH ||
    sessionSecret.length < MIN_SESSION_SECRET_LENGTH
  ) {
    return null;
  }

  return { accessPassword, sessionSecret };
}

export function sanitizeReturnTo(value: string | null, requestUrl: URL) {
  if (
    !value ||
    value.length > 2_048 ||
    !value.startsWith('/') ||
    value.startsWith('//')
  ) {
    return '/';
  }

  const candidate = new URL(value, requestUrl.origin);

  if (
    candidate.origin !== requestUrl.origin ||
    candidate.pathname.startsWith('/auth/') ||
    candidate.pathname.startsWith('/api/auth/')
  ) {
    return '/';
  }

  return `${candidate.pathname}${candidate.search}${candidate.hash}`;
}

export function currentReturnTo(requestUrl: URL) {
  return sanitizeReturnTo(
    `${requestUrl.pathname}${requestUrl.search}`,
    requestUrl,
  );
}

export function getCookieName(requestUrl: URL) {
  return requestUrl.protocol === 'https:'
    ? PRODUCTION_COOKIE_NAME
    : LOCAL_COOKIE_NAME;
}

export function readCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get('Cookie');

  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(';')) {
    const separatorIndex = part.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const cookieName = part.slice(0, separatorIndex).trim();

    if (cookieName === name) {
      return part.slice(separatorIndex + 1).trim();
    }
  }

  return null;
}

export function serializeCookie(
  requestUrl: URL,
  value: string,
  maxAge: number,
) {
  const secure = requestUrl.protocol === 'https:';
  const attributes = [
    `${getCookieName(requestUrl)}=${value}`,
    `Max-Age=${maxAge}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];

  if (secure) {
    attributes.push('Secure');
  }

  return attributes.join('; ');
}

function encodeBase64Url(bytes: Uint8Array) {
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/u, '');
}

function decodeBase64Url(value: string) {
  if (!/^[A-Za-z0-9_-]+$/u.test(value)) {
    return null;
  }

  const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');

  try {
    return Uint8Array.from(atob(padded), (character) =>
      character.charCodeAt(0),
    );
  } catch {
    return null;
  }
}

async function deriveSessionKey(config: AuthConfig) {
  const secretKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(config.sessionSecret),
    { hash: 'SHA-256', name: 'HMAC' },
    false,
    ['sign'],
  );
  const keyMaterial = await crypto.subtle.sign(
    'HMAC',
    secretKey,
    encoder.encode(
      `winwork-session:${SESSION_VERSION}:${config.accessPassword}`,
    ),
  );

  return crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { hash: 'SHA-256', name: 'HMAC' },
    false,
    ['sign', 'verify'],
  );
}

export async function createSessionToken(config: AuthConfig) {
  const expiresAt = Math.floor(Date.now() / 1_000) + SESSION_MAX_AGE_SECONDS;
  const payload = `${SESSION_VERSION}.${expiresAt}`;
  const key = await deriveSessionKey(config);
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payload),
  );

  return `${payload}.${encodeBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(
  token: string | null,
  config: AuthConfig,
) {
  if (!token) {
    return false;
  }

  const [version, expiresAtValue, signatureValue, ...extraParts] =
    token.split('.');

  if (
    version !== SESSION_VERSION ||
    !expiresAtValue ||
    !/^\d+$/u.test(expiresAtValue) ||
    !signatureValue ||
    extraParts.length > 0
  ) {
    return false;
  }

  const expiresAt = Number(expiresAtValue);
  const now = Math.floor(Date.now() / 1_000);

  if (
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= now ||
    expiresAt > now + SESSION_MAX_AGE_SECONDS + 60
  ) {
    return false;
  }

  const signature = decodeBase64Url(signatureValue);

  if (!signature) {
    return false;
  }

  const key = await deriveSessionKey(config);

  return crypto.subtle.verify(
    'HMAC',
    key,
    signature,
    encoder.encode(`${version}.${expiresAtValue}`),
  );
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < left.length; index += 1) {
    difference |= (left[index] ?? 0) ^ (right[index] ?? 0);
  }

  return difference === 0;
}

export async function passwordMatches(submitted: string, expected: string) {
  const [submittedDigest, expectedDigest] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(submitted)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ]);

  return constantTimeEqual(
    new Uint8Array(submittedDigest),
    new Uint8Array(expectedDigest),
  );
}
