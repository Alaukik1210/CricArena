import axios from "axios";
import { PAYMENT_API_END_POINT } from "@/utils/constants";

export const startPayment = async (ground) => {
  try {
    const response = await axios.post(
      `${PAYMENT_API_END_POINT}/create-payment-intent`,
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