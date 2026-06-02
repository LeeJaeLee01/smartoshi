import { useCallback, useState } from "react";
import { api } from "../api/client";
import type { ApiCallResult } from "../types/api";
import type { CreateOrderRequest } from "../types/api";
import { backendEndpoints } from "../content/docs";
import "./ApiExplorer.css";

function formatJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export function ApiExplorer() {
  const [userId, setUserId] = useState("u1");
  const [symbol, setSymbol] = useState("BTC");
  const [quantity, setQuantity] = useState("1");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiCallResult | null>(null);
  const [lastLabel, setLastLabel] = useState("");

  const run = useCallback(async (label: string, fn: () => Promise<ApiCallResult>) => {
    setLoading(true);
    setLastLabel(label);
    const res = await fn();
    setResult(res);
    if (res.ok && label === "POST /orders" && res.data && typeof res.data === "object") {
      const o = res.data as { order_id?: string };
      if (o.order_id) setOrderId(o.order_id);
    }
    setLoading(false);
  }, []);

  const orderBody: CreateOrderRequest = {
    user_id: userId,
    symbol,
    quantity: parseFloat(quantity) || 0,
    side,
  };

  return (
    <section id="backend" className="api-explorer">
      <div className="container">
        <h2 className="api-explorer__title">Backend API Explorer</h2>
        <p className="api-explorer__lead">
          Live calls to the Rust service. Start the backend with{" "}
          <code>cargo run</code> on port 3030, then use the actions below.
        </p>

        <div className="api-explorer__grid">
          <div className="api-explorer__endpoints card">
            <h3>Endpoints</h3>
            {backendEndpoints.map((group) => (
              <div key={group.group} className="endpoint-group">
                <h4>{group.group}</h4>
                <ul>
                  {group.items.map((ep) => (
                    <li key={ep.path}>
                      <span className="method">{ep.method}</span>
                      <code>{ep.path}</code>
                      <span className="desc">{ep.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="api-explorer__panel card">
            <h3>Try API</h3>
            <div className="form-row">
              <label>
                User ID
                <input value={userId} onChange={(e) => setUserId(e.target.value)} />
              </label>
              <label>
                Symbol
                <input value={symbol} onChange={(e) => setSymbol(e.target.value)} />
              </label>
            </div>
            <div className="form-row">
              <label>
                Quantity
                <input value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </label>
              <label>
                Side
                <select value={side} onChange={(e) => setSide(e.target.value as "BUY" | "SELL")}>
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </label>
            </div>
            <label>
              Order ID (for GET)
              <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="from POST /orders" />
            </label>

            <div className="api-actions">
              <button type="button" className="btn-primary" disabled={loading} onClick={() => run("GET /symbols", api.getSymbols)}>
                Symbols
              </button>
              <button type="button" className="btn-secondary" disabled={loading} onClick={() => run("GET /prices", api.getPrices)}>
                Prices
              </button>
              <button type="button" className="btn-secondary" disabled={loading} onClick={() => run(`GET /prices/${symbol}`, () => api.getPrice(symbol))}>
                Price
              </button>
              <button type="button" className="btn-secondary" disabled={loading} onClick={() => run(`GET /portfolio/${userId}`, () => api.getPortfolio(userId))}>
                Portfolio
              </button>
              <button type="button" className="btn-primary" disabled={loading} onClick={() => run("POST /orders", () => api.createOrder(orderBody))}>
                Create Order
              </button>
              <button type="button" className="btn-utility" disabled={loading || !orderId} onClick={() => run(`GET /orders/${orderId}`, () => api.getOrder(orderId))}>
                Get Order
              </button>
            </div>

            {lastLabel && (
              <div className="api-result">
                <p>
                  <strong>{lastLabel}</strong>{" "}
                  <span className={result?.ok ? "status-ok" : "status-err"}>
                    {result ? `${result.status} · ${result.durationMs}ms` : ""}
                  </span>
                </p>
                <pre className="pre-block">{result ? formatJson(result.data) : ""}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
