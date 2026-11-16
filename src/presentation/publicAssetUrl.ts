declare global {
  interface Window {
    __WINWORK_OFFLINE_ASSETS__?: Readonly<Record<string, string>>;
  }
}

export function publicAssetUrl(path: string) {
  return window.__WINWORK_OFFLINE_ASSETS__?.[path] ?? path;
}

export function publicAssetDocument(path: string) {
  const asset = window.__WINWORK_OFFLINE_ASSETS__?.[path];
  const prefix = 'data:text/html;base64,';

  if (!asset?.startsWith(prefix)) return undefined;

  return new TextDecoder().decode(
    Uint8Array.from(atob(asset.slice(prefix.length)), (char) =>
      char.charCodeAt(0),
    ),
  );
}
