/**
 * Server-only helper for calling Google Maps Platform through the Lovable
 * connector gateway. Never import this from client code.
 */
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

export class MapsUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MapsUnavailableError";
  }
}

function credentials() {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_MAPS_API_KEY"];
  if (!lovableKey || !connectionKey) {
    throw new MapsUnavailableError("Map services are not configured.");
  }
  return { lovableKey, connectionKey };
}

export async function mapsFetch<T>(
  path: string,
  init?: { method?: string; body?: unknown; headers?: Record<string, string> },
): Promise<T> {
  const { lovableKey, connectionKey } = credentials();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": connectionKey,
    ...(init?.headers ?? {}),
  };
  if (init?.body !== undefined) headers["Content-Type"] = "application/json";

  const requestInit: RequestInit = { method: init?.method ?? "GET", headers };
  if (init?.body !== undefined) requestInit.body = JSON.stringify(init.body);

  let response: Response;
  try {
    response = await fetch(`${GATEWAY_URL}${path}`, requestInit);
  } catch {
    throw new MapsUnavailableError("We couldn't reach the map service. Check your connection.");
  }

  if (response.status === 403) {
    const details: Array<{ reason?: string }> =
      (await response.json().catch(() => null))?.error?.details ?? [];
    const reason = details.find((d) => d.reason)?.reason;
    if (reason === "API_KEY_HTTP_REFERRER_BLOCKED") {
      throw new MapsUnavailableError(
        'Map server key is referrer-restricted. Set the server key application restrictions to "None" or "IP addresses".',
      );
    }
    if (reason === "API_KEY_SERVICE_BLOCKED") {
      throw new MapsUnavailableError(
        "The map server key does not allow this API. Add it to the key's allowed-APIs list.",
      );
    }
    throw new MapsUnavailableError("The map request was denied (403).");
  }

  if (!response.ok) {
    const body = await response.text();
    console.error(`Google Maps gateway failed [${response.status}]: ${body}`);
    throw new MapsUnavailableError("Data unavailable right now. Please try again.");
  }

  return (await response.json()) as T;
}
