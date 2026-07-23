import PaymentPageContent from "../components/payment/payment-page-content";
import { getBanks } from "../services/banks-service";
import { mapApiBankToBankDisplay } from "../lib/mappers";

export default async function PaymentPage() {
  let banks: ReturnType<typeof mapApiBankToBankDisplay>[] = [];

  try {
    const apiBanks = await getBanks();
    banks = apiBanks.map(mapApiBankToBankDisplay);
  } catch {
    banks = [];
  }

  return <PaymentPageContent banks={banks} />;
}
