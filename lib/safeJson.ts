/**
 * safeJson.ts — Safe JSON parsing for proxy route responses.
 *
 * Dashboard responses may return HTML, empty bodies, or redirects
 * instead of JSON. Calling response.json() directly on these
 * throws a SyntaxError, which hides the real error behind a
 * generic 500 "Internal server error" in the catch block.
 *
 * This utility tries JSON first, falls back to text, and always
 * logs something useful.
 */

export async function safeJson(response: Response, proxyName: string): Promise<{ data: unknown; parseError: boolean }> {
    const text = await response.text();
    try {
        return { data: JSON.parse(text), parseError: false };
    } catch {
        console.error(`[${proxyName}] Dashboard returned non-JSON (status ${response.status}):`, text.slice(0, 500));
        return { data: { error: `Dashboard returned non-JSON response (status ${response.status})` }, parseError: true };
    }
}
