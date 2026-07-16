export type TBankAccount = {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
};

export const bankAccounts: TBankAccount[] = [
  {
    bankName: "Bank Central Asia (BCA)",
    accountNumber: "1234567890",
    accountHolder: "PT SportOn Indonesia",
  },
  {
    bankName: "Bank Mandiri",
    accountNumber: "0987654321",
    accountHolder: "PT SportOn Indonesia",
  },
];
