import type { TCheckoutFormData } from "../../types/checkout";

type TCustomerShippingSummaryProps = {
  checkoutInfo: TCheckoutFormData;
};

const CustomerShippingSummary = ({
  checkoutInfo,
}: TCustomerShippingSummaryProps) => {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <div>
        <h2 className="mb-4 text-lg font-bold sm:text-xl">
          Customer Information
        </h2>
        <dl className="flex flex-col gap-2 text-sm sm:text-base">
          <div className="flex justify-between gap-4">
            <dt className="text-dark/60">Full Name</dt>
            <dd className="text-right font-medium">{checkoutInfo.fullName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-dark/60">Email</dt>
            <dd className="text-right font-medium">{checkoutInfo.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-dark/60">Phone</dt>
            <dd className="text-right font-medium">{checkoutInfo.phone}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-bold sm:text-xl">
          Shipping Information
        </h2>
        <dl className="flex flex-col gap-2 text-sm sm:text-base">
          <div className="flex justify-between gap-4">
            <dt className="text-dark/60">Address</dt>
            <dd className="text-right font-medium">{checkoutInfo.address}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-dark/60">City</dt>
            <dd className="text-right font-medium">{checkoutInfo.city}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-dark/60">Province/State</dt>
            <dd className="text-right font-medium">{checkoutInfo.province}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-dark/60">Postal Code</dt>
            <dd className="text-right font-medium">
              {checkoutInfo.postalCode}
            </dd>
          </div>
          {checkoutInfo.notes && (
            <div className="flex justify-between gap-4">
              <dt className="text-dark/60">Notes</dt>
              <dd className="text-right font-medium">{checkoutInfo.notes}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default CustomerShippingSummary;
