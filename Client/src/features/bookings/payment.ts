import { api } from "@/lib/api";

export const startPayment = async (ground: { pricePerMatch: number }): Promise<string> => {
  try {
    const response = await api.post<{ clientSecret: string }>(
      "/payment/create-payment-intent",
      {
        amount: ground.pricePerMatch * 100,
        currency: "inr",
      }
    );

    return response.data.clientSecret;
  } catch (error) {
    console.error("Error creating payment session:", error);
    throw new Error("Payment initiation failed");
  }
};
