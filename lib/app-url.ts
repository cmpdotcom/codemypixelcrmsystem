/** Public origin of this app. Set NEXT_PUBLIC_URL in every environment. */
export function getAppUrl(request?: { headers: { get(name: string): string | null } }): string {
  const configured =
    process.env.NEXT_PUBLIC_URL ||
    process.env.AUTH_URL ||
    process.env.NEXTAUTH_URL;

  if (configured) return configured.replace(/\/+$/, "");

  if (request) {
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || "http";
    if (host) return `${proto}://${host}`;
  }

  return "http://localhost:3000";
}

/** Turn a site path or an already-absolute URL into an absolute URL. */
export function toAbsoluteUrl(pathOrUrl: string, request?: { headers: { get(name: string): string | null } }): string {
  if (!pathOrUrl) return getAppUrl(request);
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${getAppUrl(request)}${path}`;
}
