export type TCheckoutFormData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes: string;
};

export type TCheckoutFormErrors = Partial<Record<keyof TCheckoutFormData, string>>;
