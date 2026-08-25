import {
  createSessionToken,
  LOGIN_PAGE_PATH,
  passwordMatches,
  readAuthConfig,
  sanitizeReturnTo,
  serializeCookie,
  SESSION_MAX_AGE_SECONDS,
} from '../../auth/session.ts';

function plainResponse(message: string, status: number, allow?: string) {
  const headers = new Headers({
    'Cache-Control': 'no-store',
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  });

  if (allow) {
    headers.set('Allow', allow);
  }

  return new Response(message, { status, headers });
}

function redirectResponse(location: string, cookie?: string) {
  const headers = new Headers({
    'Cache-Control': 'no-store',
    Location: location,
  });

  if (cookie) {
    headers.set('Set-Cookie', cookie);
  }

  return new Response(null, { status: 303, headers });
}

function invalidPasswordRedirect(returnTo: string) {
  const search = new URLSearchParams({ error: 'invalid', returnTo });

  return redirectResponse(`${LOGIN_PAGE_PATH}?${search.toString()}`);
}

export default async function login(request: Request) {
  if (request.method !== 'POST') {
    return plainResponse('Метод не поддерживается.', 405, 'POST');
  }

  const requestUrl = new URL(request.url);
  const config = readAuthConfig();

  if (!config) {
    return plainResponse('Сервис временно недоступен.', 503);
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return plainResponse('Некорректный запрос.', 400);
  }

  const passwordValue = formData.get('password');
  const returnToValue = formData.get('returnTo');
  const returnTo = sanitizeReturnTo(
    typeof returnToValue === 'string' ? returnToValue : null,
    requestUrl,
  );
  const password = typeof passwordValue === 'string' ? passwordValue : '';

  if (
    password.length > 512 ||
    !(await passwordMatches(password, config.accessPassword))
  ) {
    return invalidPasswordRedirect(returnTo);
  }

  const token = await createSessionToken(config);

  return redirectResponse(
    returnTo,
    serializeCookie(requestUrl, token, SESSION_MAX_AGE_SECONDS),
  );
}

export const config = {
  runtime: 'edge',
};
