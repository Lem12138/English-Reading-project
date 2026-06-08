import { ProxyAgent, fetch as undiciFetch } from 'undici';

let agent: ProxyAgent | undefined;

function getAgent(): ProxyAgent | undefined {
  const url = process.env.PROXY_URL;
  if (!url) return undefined;
  if (!agent) agent = new ProxyAgent(url);
  return agent;
}

export function proxyFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const dispatcher = getAgent();
  if (dispatcher) {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;
    return undiciFetch(url, { ...init, dispatcher } as any) as unknown as Promise<Response>;
  }
  return fetch(input, init);
}
