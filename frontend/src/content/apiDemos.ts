export type ApiDemoId =
  | "get-symbols"
  | "get-prices"
  | "get-price"
  | "get-portfolio"
  | "post-orders"
  | "get-order";

export type ParamLocation = "path" | "body";

export interface ApiParamField {
  key: string;
  label: string;
  placeholder: string;
  location: ParamLocation;
  inputType?: "text" | "number" | "select";
  options?: string[];
  required?: boolean;
}

export interface ApiDemoConfig {
  id: ApiDemoId;
  group: string;
  method: string;
  path: string;
  description: string;
  params: ApiParamField[];
}

export const apiDemos: ApiDemoConfig[] = [
  {
    id: "get-symbols",
    group: "Market Service",
    method: "GET",
    path: "/symbols",
    description: "Returns all tradable symbols.",
    params: [],
  },
  {
    id: "get-prices",
    group: "Market Service",
    method: "GET",
    path: "/prices",
    description: "Returns mock prices for every symbol.",
    params: [],
  },
  {
    id: "get-price",
    group: "Market Service",
    method: "GET",
    path: "/prices/{symbol}",
    description: "Returns price for one symbol. Try FAIL to simulate market outage.",
    params: [
      {
        key: "symbol",
        label: "symbol",
        placeholder: "BTC",
        location: "path",
        required: true,
      },
    ],
  },
  {
    id: "get-portfolio",
    group: "Portfolio Service",
    method: "GET",
    path: "/portfolio/{userId}",
    description: "Returns cash balance and asset holdings for a user.",
    params: [
      {
        key: "userId",
        label: "userId",
        placeholder: "u1",
        location: "path",
        required: true,
      },
    ],
  },
  {
    id: "post-orders",
    group: "Portfolio Service",
    method: "POST",
    path: "/orders",
    description: "Creates a market order (BUY or SELL) and updates portfolio.",
    params: [
      {
        key: "userId",
        label: "user_id",
        placeholder: "u1",
        location: "body",
        required: true,
      },
      {
        key: "symbol",
        label: "symbol",
        placeholder: "BTC",
        location: "body",
        required: true,
      },
      {
        key: "quantity",
        label: "quantity",
        placeholder: "1",
        location: "body",
        inputType: "number",
        required: true,
      },
      {
        key: "side",
        label: "side",
        placeholder: "BUY",
        location: "body",
        inputType: "select",
        options: ["BUY", "SELL"],
        required: true,
      },
    ],
  },
  {
    id: "get-order",
    group: "Portfolio Service",
    method: "GET",
    path: "/orders/{orderId}",
    description: "Fetches order details by ID (use order_id from POST /orders).",
    params: [
      {
        key: "orderId",
        label: "orderId",
        placeholder: "paste order_id here",
        location: "path",
        required: true,
      },
    ],
  },
];
