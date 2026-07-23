import type { TBankDisplay } from "../../lib/mappers";

type TBankInfoProps = {
  banks: TBankDisplay[];
};

const BankInfo = ({ banks }: TBankInfoProps) => {
  if (banks.length === 0) {
    return (
      <p className="text-sm text-dark/60">
        Bank information is unavailable right now. Please try again later.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {banks.map((bank) => (
        <div key={bank.id} className="border border-dark/10 p-4 sm:p-5">
          <div className="text-sm font-medium text-primary">
            {bank.bankName}
          </div>
          <div className="mt-1 text-lg font-bold tracking-wide">
            {bank.accountNumber}
          </div>
          <div className="text-sm text-dark/60">a.n. {bank.accountName}</div>
        </div>
      ))}
    </div>
  );
};

export default BankInfo;
