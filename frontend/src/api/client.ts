import type { CreateOrderRequest } from "../types/api";
import type { ApiCallResult } from "../types/api";

const API_BASE =
  process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:3030";

async function request(path: string, init?: RequestInit): Promise<ApiCallResult> {
  const started = performance.now();
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    });
    const text = await res.text();
    let data: unknown = text;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      /* keep raw text */
    }
    return {
      ok: res.ok,
      status: res.status,
      data,
      durationMs: Math.round(performance.now() - started),
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: {
        error: err instanceof Error ? err.message : "Network error",
        hint: "Ensure Rust backend is running: cargo run (port 3030)",
      },
      durationMs: Math.round(performance.now() - started),
    };
  }
}

export function getApiBase(): string {
  return API_BASE;
}

export const api = {
  getSymbols: () => request("/symbols"),
  getPrices: () => request("/prices"),
  getPrice: (symbol: string) =>
    request(`/prices/${encodeURIComponent(symbol)}`),
  getPortfolio: (userId: string) =>
    request(`/portfolio/${encodeURIComponent(userId)}`),
  createOrder: (body: CreateOrderRequest) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getOrder: (orderId: string) =>
    request(`/orders/${encodeURIComponent(orderId)}`),
};
