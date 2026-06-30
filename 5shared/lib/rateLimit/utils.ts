import { headers } from "next/headers";

/**
 * Extracts client IP address from request headers
 * Prioritizes x-forwarded-for and x-real-ip headers for proxy/CDN support
 * @returns IP address or "unknown" if not found
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers();

  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0].trim();
    return firstIp;
  }

  const realIp = headersList.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}
