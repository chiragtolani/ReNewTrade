export interface Transaction {
  id: string;
  type: "sell" | "buy";
  amount: number;
  price: number;
  total: number;
  netAmount: number;
  utilityFee: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  counterparty: string;
} 