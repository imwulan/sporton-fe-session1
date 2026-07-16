import FormField from "../ui/form-field";
import type { TCheckoutFormData, TCheckoutFormErrors } from "../../types/checkout";

type TCheckoutFormProps = {
  values: TCheckoutFormData;
  errors: TCheckoutFormErrors;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

const CheckoutForm = ({ values, errors, onChange }: TCheckoutFormProps) => {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="mb-5 text-lg font-bold sm:text-xl">
          Customer Information
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="Full Name"
            name="fullName"
            value={values.fullName}
            onChange={onChange}
            placeholder="John Doe"
            required
            error={errors.fullName}
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={onChange}
            placeholder="john@example.com"
            required
            error={errors.email}
          />
          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={onChange}
            placeholder="08123456789"
            required
            error={errors.phone}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-5 text-lg font-bold sm:text-xl">
          Shipping Information
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField
              label="Address"
              name="address"
              value={values.address}
              onChange={onChange}
              placeholder="Street name, house number"
              required
              error={errors.address}
            />
          </div>
          <FormField
            label="City"
            name="city"
            value={values.city}
            onChange={onChange}
            required
            error={errors.city}
          />
          <FormField
            label="Province/State"
            name="province"
            value={values.province}
            onChange={onChange}
            required
            error={errors.province}
          />
          <FormField
            label="Postal Code"
            name="postalCode"
            value={values.postalCode}
            onChange={onChange}
            required
            error={errors.postalCode}
          />
          <div className="sm:col-span-2">
            <FormField
              label="Notes"
              name="notes"
              value={values.notes}
              onChange={onChange}
              placeholder="Delivery instructions (optional)"
              multiline
              error={errors.notes}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
