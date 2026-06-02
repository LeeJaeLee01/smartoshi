import { useCallback, useMemo, useState } from "react";
import { api, getApiBase } from "../api/client";
import type { ApiCallResult, CreateOrderRequest } from "../types/api";
import { apiDemos, type ApiDemoId, type ApiParamField } from "../content/apiDemos";
import "./ApiExplorer.css";

function formatJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

type ParamValues = Record<string, string>;

const initialParams: ParamValues = {
  userId: "u1",
  symbol: "BTC",
  quantity: "1",
  side: "BUY",
  orderId: "",
};

function buildPath(template: string, values: ParamValues): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const v = values[key];
    return v !== undefined && v !== "" ? encodeURIComponent(v) : `{${key}}`;
  });
}

function resolvePathForDemo(id: ApiDemoId, template: string, values: ParamValues): string {
  switch (id) {
    case "get-price":
      return `/prices/${encodeURIComponent(values.symbol || "")}`;
    case "get-portfolio":
      return `/portfolio/${encodeURIComponent(values.userId || "")}`;
    case "get-order":
      return `/orders/${encodeURIComponent(values.orderId || "")}`;
    default:
      return buildPath(template, values);
  }
}

export function ApiExplorer() {
  const [selectedId, setSelectedId] = useState<ApiDemoId>("get-symbols");
  const [params, setParams] = useState<ParamValues>(initialParams);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiCallResult | null>(null);

  const selected = useMemo(
    () => apiDemos.find((d) => d.id === selectedId) ?? apiDemos[0],
    [selectedId]
  );

  const resolvedPath = useMemo(
    () => resolvePathForDemo(selectedId, selected.path, params),
    [selectedId, selected.path, params]
  );

  const fullUrl = `${getApiBase()}${resolvedPath}`;

  const pathParams = selected.params.filter((p) => p.location === "path");
  const bodyParams = selected.params.filter((p) => p.location === "body");

  const requestBodyPreview = useMemo(() => {
    if (selectedId !== "post-orders") return null;
    const body: CreateOrderRequest = {
      user_id: params.userId,
      symbol: params.symbol,
      quantity: parseFloat(params.quantity) || 0,
      side: params.side as "BUY" | "SELL",
    };
    return formatJson(body);
  }, [selectedId, params]);

  const missingRequired = selected.params
    .filter((p) => p.required)
    .filter((p) => !params[p.key]?.trim());

  const setParam = (key: string, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const selectRow = (id: ApiDemoId) => {
    setSelectedId(id);
    setResult(null);
  };

  const runDemo = useCallback(async () => {
    setLoading(true);
    setResult(null);
    let res: ApiCallResult;

    switch (selectedId) {
      case "get-symbols":
        res = await api.getSymbols();
        break;
      case "get-prices":
        res = await api.getPrices();
        break;
      case "get-price":
        res = await api.getPrice(params.symbol);
        break;
      case "get-portfolio":
        res = await api.getPortfolio(params.userId);
        break;
      case "post-orders":
        res = await api.createOrder({
          user_id: params.userId,
          symbol: params.symbol,
          quantity: parseFloat(params.quantity) || 0,
          side: params.side as "BUY" | "SELL",
        });
        if (res.ok && res.data && typeof res.data === "object") {
          const o = res.data as { order_id?: string };
          const newOrderId = o.order_id;
          if (newOrderId) {
            setParams((prev) => ({ ...prev, orderId: newOrderId }));
          }
        }
        break;
      case "get-order":
        res = await api.getOrder(params.orderId);
        break;
      default:
        res = { ok: false, status: 0, data: { error: "Unknown endpoint" }, durationMs: 0 };
    }

    setResult(res);
    setLoading(false);
  }, [selectedId, params]);

  const renderField = (field: ApiParamField) => {
    const value = params[field.key] ?? "";
    if (field.inputType === "select" && field.options) {
      return (
        <select
          value={value}
          onChange={(e) => setParam(field.key, e.target.value)}
        >
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        type={field.inputType === "number" ? "number" : "text"}
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => setParam(field.key, e.target.value)}
      />
    );
  };

  const renderParamTable = (fields: ApiParamField[], title: string) => {
    if (fields.length === 0) return null;
    return (
      <div className="param-block">
        <h4 className="param-block__title">{title}</h4>
        <table className="param-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
              <th>In</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => (
              <tr key={field.key}>
                <td>
                  <code>{field.label}</code>
                  {field.required && <span className="required"> *</span>}
                </td>
                <td>{renderField(field)}</td>
                <td className="param-loc">{field.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <section id="backend" className="api-explorer">
      <div className="container">
        <h2 className="api-explorer__title">Backend API Explorer</h2>
        <p className="api-explorer__lead">
          Bấm endpoint trong bảng → nhập tham số → Send request. Base:{" "}
          <code>{getApiBase()}</code>
        </p>

        <div className="api-explorer__layout">
          <div className="api-explorer__table-wrap card">
            <h3>Endpoints</h3>
            <table className="endpoint-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Path</th>
                  <th>Params</th>
                </tr>
              </thead>
              <tbody>
                {apiDemos.map((ep) => (
                  <tr
                    key={ep.id}
                    className={
                      selectedId === ep.id ? "endpoint-row endpoint-row--active" : "endpoint-row"
                    }
                    onClick={() => selectRow(ep.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        selectRow(ep.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                  >
                    <td>
                      <span className={`method-badge method-badge--${ep.method.toLowerCase()}`}>
                        {ep.method}
                      </span>
                    </td>
                    <td>
                      <code>{ep.path}</code>
                    </td>
                    <td className="endpoint-params-hint">
                      {ep.params.length === 0
                        ? "—"
                        : ep.params.map((p) => p.label).join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="api-explorer__panel card">
            <h3>Try API</h3>
            <div className="try-api-header">
              <span className={`method-badge method-badge--${selected.method.toLowerCase()}`}>
                {selected.method}
              </span>
              <code className="try-api-url">{fullUrl}</code>
            </div>
            <p className="try-api-desc">{selected.description}</p>

            {selected.params.length === 0 ? (
              <p className="try-api-hint">Endpoint này không có tham số.</p>
            ) : (
              <>
                {renderParamTable(pathParams, "Path parameters")}
                {renderParamTable(bodyParams, "Body parameters (JSON)")}
                {requestBodyPreview && (
                  <>
                    <h4 className="param-block__title">Request body preview</h4>
                    <pre className="pre-block">{requestBodyPreview}</pre>
                  </>
                )}
              </>
            )}

            {missingRequired.length > 0 && (
              <p className="param-error">
                Thiếu tham số bắt buộc: {missingRequired.map((p) => p.label).join(", ")}
              </p>
            )}

            <button
              type="button"
              className="btn-primary try-api-run"
              disabled={loading || missingRequired.length > 0}
              onClick={runDemo}
            >
              {loading ? "Sending…" : "Send request"}
            </button>

            {result && (
              <div className="api-result">
                <h4 className="param-block__title">Response</h4>
                <p>
                  <span className={result.ok ? "status-ok" : "status-err"}>
                    {result.status} · {result.durationMs}ms
                  </span>
                </p>
                <pre className="pre-block">{formatJson(result.data)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
