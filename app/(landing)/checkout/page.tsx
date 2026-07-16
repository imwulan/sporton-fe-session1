"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "../components/ui/container";
import Button from "../components/ui/button";
import CheckoutForm from "../components/checkout/checkout-form";
import OrderSummary from "../components/checkout/order-summary";
import { useCart } from "../context/cart-context";
import { SHIPPING_COST } from "../data/shipping";
import type { TCheckoutFormData, TCheckoutFormErrors } from "../types/checkout";

const initialFormData: TCheckoutFormData = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  notes: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (values: TCheckoutFormData): TCheckoutFormErrors => {
  const errors: TCheckoutFormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone number is required.";
  }

  if (!values.address.trim()) {
    errors.address = "Address is required.";
  }

  if (!values.city.trim()) {
    errors.city = "City is required.";
  }

  if (!values.province.trim()) {
    errors.province = "Province/State is required.";
  }

  if (!values.postalCode.trim()) {
    errors.postalCode = "Postal code is required.";
  }

  return errors;
};

export default function CheckoutPage() {
  const { items, subtotal, setCheckoutInfo } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState<TCheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<TCheckoutFormErrors>({});

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setCheckoutInfo(formData);
    router.push("/payment");
  };

  if (items.length === 0) {
    return (
      <main>
        <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-5 py-20 text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Your cart is empty</h1>
          <p className="text-dark/60">
            Add some products to your cart before proceeding to checkout.
          </p>
          <Button href="/">Continue Shopping</Button>
        </Container>
      </main>
    );
  }

  return (
    <main>
      <Container className="py-12 lg:py-16">
        <h1 className="mb-10 text-2xl font-bold sm:text-3xl">Checkout</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
            <div className="w-full lg:w-3/5">
              <CheckoutForm
                values={formData}
                errors={errors}
                onChange={handleChange}
              />
            </div>

            <div className="w-full lg:w-2/5">
              <OrderSummary
                items={items}
                subtotal={subtotal}
                shippingCost={SHIPPING_COST}
              />
            </div>
          </div>
        </form>
      </Container>
    </main>
  );
}
