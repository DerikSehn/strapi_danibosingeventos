// c:\Users\DSEHN\Documents\personal\strapi_danibosingeventos\frontend\lib\api.ts
import { OrderPayload, OrderApiResponse } from "../types";
import { getStrapiURL } from "./utils";

const STRAPI_URL = getStrapiURL();

// Function to submit the order
export async function submitOrder(orderPayload: OrderPayload): Promise<OrderApiResponse> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if required
        // 'Authorization': `Bearer YOUR_API_TOKEN`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(errorData.error?.message ?? `Failed to submit order. Status: ${response.status}`);
    }

    const data: OrderApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Submit order error:", error);
    // Ensure a consistent error structure for the mutation's onError handler
    if (error instanceof Error) {
        throw error; // rethrow if already an Error object
    }
    throw new Error("An unexpected error occurred while submitting the order.");
  }
}

// You might want to add other API functions here, for example:
// - Fetching a specific order by ID
// - Fetching user's order history
