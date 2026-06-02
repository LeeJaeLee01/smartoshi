export interface SymbolsResponse {
  symbols: string[];
}

export interface PricesResponse {
  prices: Record<string, number>;
}

export interface PriceBySymbolResponse {
  symbol: string;
  price: number;
}

export interface Portfolio {
  user_id: string;
  cash_balance: number;
  assets: Record<string, number>;
}

export type OrderSide = "BUY" | "SELL";

export interface CreateOrderRequest {
  user_id: string;
  symbol: string;
  quantity: number;
  side: OrderSide;
}

export type OrderStatus = "CREATED" | "EXECUTED" | "REJECTED";

export interface Order {
  order_id: string;
  user_id: string;
  symbol: string;
  quantity: number;
  side: OrderSide;
  price?: number;
  status: OrderStatus;
  reason?: string;
}

export interface ErrorResponse {
  error: string;
}

export interface ApiCallResult {
  ok: boolean;
  status: number;
  data: unknown;
  durationMs: number;
}
