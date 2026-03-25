"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

export default function CheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      setMessage(error.message ?? "An unexpected error occurred.");
    }
    // On success, Stripe redirects to return_url automatically.
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-gray-500">Total</span>
        <span className="text-xl font-bold text-gray-900">
          ${amount.toFixed(2)} USD
        </span>
      </div>

      <PaymentElement />

      {message && <p className="text-sm text-red-600">{message}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
      >
        {loading ? "Processing…" : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}
