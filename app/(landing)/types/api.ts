export type TApiCategory = {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type TApiProduct = {
  _id: string;
  name: string;
  description: string;
  category: TApiCategory;
  stock: number;
  price: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Matches the shape of one entry inside Transaction.purchasedItems, as
 * documented in schemas.txt and shown in the POST /transactions/checkout
 * example payloads: [{ "productId": "...", "qty": 1 }].
 */
export type TApiPurchasedItem = {
  productId: string;
  qty: number;
};

/**
 * Mirrors the Bank schema from schemas.txt exactly.
 */
export type TApiBank = {
  _id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Mirrors the Transaction schema from schemas.txt exactly.
 */
export type TApiTransaction = {
  _id: string;
  paymentProof: string;
  status: string;
  purchasedItems: TApiPurchasedItem[];
  totalPayment: number;
  customerName: string;
  customerContact: string;
  customerAddress: string;
  createdAt: string;
  updatedAt: string;
};
