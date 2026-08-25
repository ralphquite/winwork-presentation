import { next } from '@vercel/functions';

import {
  currentReturnTo,
  getCookieName,
  LOGIN_API_PATH,
  LOGIN_PAGE_PATH,
  LOGOUT_PATH,
  readAuthConfig,
  readCookie,
  sanitizeReturnTo,
  serializeCookie,
  verifySessionToken,
} from './auth/session.ts';

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character] ?? character,
  );
}

function renderAccessPage(options: {
  error?: string;
  returnTo: string;
  unavailable?: boolean;
}) {
  const { error, returnTo, unavailable = false } = options;
  const title = unavailable
    ? 'Сервис временно недоступен'
    : 'Доступ к демонстрации';
  const description = unavailable
    ? 'Настройки доступа ещё не готовы. Обратитесь к владельцу презентации.'
    : 'Введите общий пароль отдела продаж, чтобы открыть презентации WinWork.';
  const form = unavailable
    ? ''
    : `<form action="${LOGIN_API_PATH}" method="post">
          <input name="returnTo" type="hidden" value="${escapeHtml(returnTo)}" />
          <label for="password">Пароль</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            autofocus
          />
          ${error ? `<p class="error" role="alert">${escapeHtml(error)}</p>` : ''}
          <button type="submit">Войти</button>
        </form>`;

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow, noarchive" />
    <title>${title} · WinWork</title>
    <style>
      :root {
        color: #172033;
        background: #edf2f8;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system,
          BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-synthesis: none;
      }

      * {
        box-sizing: border-box;
      }

      body {
        min-width: 320px;
        min-height: 100vh;
        margin: 0;
      }

      main {
        position: relative;
        display: grid;
        min-height: 100vh;
        place-items: center;
        overflow: hidden;
        padding: 32px 20px;
        background:
          radial-gradient(circle at 85% 0%, #dce9ff 0%, #dce9ff00 42%),
          radial-gradient(circle at 0% 100%, #ddf9e6 0%, #ddf9e600 44%),
          linear-gradient(180deg, #ffffff 0%, #edf2f8 100%);
      }

      .card {
        position: relative;
        width: min(460px, calc(100vw - 40px));
        min-width: 0;
        padding: 36px;
        border: 1px solid #e2e7ee;
        border-radius: 28px;
        background: #fffffff2;
        box-shadow: 0 26px 70px #17203318;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 22px;
        font-weight: 750;
        letter-spacing: -0.02em;
      }

      .mark {
        display: grid;
        width: 42px;
        height: 42px;
        place-items: center;
        border-radius: 12px;
        background: linear-gradient(135deg, #2a73ff 0 52%, #3fe171 52% 100%);
        box-shadow: 0 10px 24px #2a73ff2b;
        color: #ffffff;
        font-size: 20px;
        font-weight: 800;
      }

      .eyebrow {
        margin: 42px 0 0;
        color: #2a73ff;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.14em;
      }

      h1 {
        margin: 12px 0 0;
        font-size: clamp(32px, 8vw, 42px);
        letter-spacing: -0.04em;
        line-height: 1.05;
      }

      .description {
        margin: 18px 0 0;
        color: #5e6a7d;
        font-size: 16px;
        line-height: 1.55;
      }

      form {
        display: grid;
        gap: 10px;
        margin-top: 32px;
      }

      label {
        font-size: 14px;
        font-weight: 700;
      }

      input[type="password"] {
        width: 100%;
        height: 52px;
        padding: 0 16px;
        border: 1px solid #cfd8e5;
        border-radius: 14px;
        background: #ffffff;
        color: #172033;
        font: inherit;
        transition: border-color 160ms ease, box-shadow 160ms ease;
      }

      input[type="password"]:focus-visible {
        border-color: #2a73ff;
        box-shadow: 0 0 0 4px #2a73ff1f;
        outline: none;
      }

      button {
        height: 52px;
        margin-top: 8px;
        border: 0;
        border-radius: 14px;
        background: #2a73ff;
        box-shadow: 0 12px 24px #2a73ff29;
        color: #ffffff;
        cursor: pointer;
        font: inherit;
        font-weight: 750;
        transition: background 160ms ease, transform 160ms ease;
      }

      button:hover {
        background: #1555d8;
        transform: translateY(-1px);
      }

      button:focus-visible {
        outline: 3px solid #172033;
        outline-offset: 3px;
      }

      .error {
        margin: 2px 0 0;
        color: #b42318;
        font-size: 14px;
        line-height: 1.4;
      }

      @media (max-width: 520px) {
        main {
          align-items: start;
          padding-top: 24px;
        }

        .card {
          padding: 28px 24px;
          border-radius: 22px;
        }

        .eyebrow {
          margin-top: 36px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        input,
        button {
          transition: none;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="card" aria-labelledby="access-title">
        <div class="brand"><span class="mark" aria-hidden="true">W</span>WinWork</div>
        <p class="eyebrow">GUIDED SALES DEMO</p>
        <h1 id="access-title">${title}</h1>
        <p class="description">${description}</p>
        ${form}
      </section>
    </main>
  </body>
</html>`;
}

function accessPageResponse(
  request: Request,
  options: Parameters<typeof renderAccessPage>[0],
  status: number,
) {
  return new Response(
    request.method === 'HEAD' ? null : renderAccessPage(options),
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Security-Policy':
          "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
        'Content-Type': 'text/html; charset=utf-8',
        'Referrer-Policy': 'no-referrer',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
      },
    },
  );
}

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

function isHtmlNavigation(request: Request) {
  return (
    request.headers.get('Sec-Fetch-Dest') === 'document' ||
    (request.headers.get('Accept') ?? '').includes('text/html')
  );
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

export default async function middleware(request: Request) {
  const requestUrl = new URL(request.url);
  const config = readAuthConfig();

  if (!config) {
    if (isHtmlNavigation(request)) {
      return accessPageResponse(
        request,
        { returnTo: '/', unavailable: true },
        503,
      );
    }

    return plainResponse('Сервис временно недоступен.', 503);
  }

  if (requestUrl.pathname === LOGIN_API_PATH) {
    if (request.method !== 'POST') {
      return plainResponse('Метод не поддерживается.', 405, 'POST');
    }

    return next();
  }

  if (requestUrl.pathname === LOGOUT_PATH) {
    if (request.method !== 'POST') {
      return plainResponse('Метод не поддерживается.', 405, 'POST');
    }

    return redirectResponse('/', serializeCookie(requestUrl, '', 0));
  }

  if (requestUrl.pathname === LOGIN_PAGE_PATH) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return plainResponse('Метод не поддерживается.', 405, 'GET, HEAD');
    }

    const returnTo = sanitizeReturnTo(
      requestUrl.searchParams.get('returnTo'),
      requestUrl,
    );
    const token = readCookie(request, getCookieName(requestUrl));

    if (await verifySessionToken(token, config)) {
      return redirectResponse(returnTo);
    }

    return accessPageResponse(
      request,
      {
        error:
          requestUrl.searchParams.get('error') === 'invalid'
            ? 'Неверный пароль.'
            : undefined,
        returnTo,
      },
      401,
    );
  }

  const token = readCookie(request, getCookieName(requestUrl));

  if (await verifySessionToken(token, config)) {
    return next({
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
      },
    });
  }

  if (
    (request.method === 'GET' || request.method === 'HEAD') &&
    isHtmlNavigation(request)
  ) {
    return accessPageResponse(
      request,
      { returnTo: currentReturnTo(requestUrl) },
      401,
    );
  }

  return plainResponse('Требуется авторизация.', 401);
}

export const config = {
  runtime: 'edge',
};
