import { bankAccounts } from "../../data/payment";

const BankInfo = () => {
  return (
    <div className="flex flex-col gap-4">
      {bankAccounts.map((account) => (
        <div
          key={account.accountNumber}
          className="border border-dark/10 p-4 sm:p-5"
        >
          <div className="text-sm font-medium text-primary">
            {account.bankName}
          </div>
          <div className="mt-1 text-lg font-bold tracking-wide">
            {account.accountNumber}
          </div>
          <div className="text-sm text-dark/60">a.n. {account.accountHolder}</div>
        </div>
      ))}
    </div>
  );
};

export default BankInfo;
