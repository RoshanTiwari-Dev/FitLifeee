import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_yourkeyhere",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "your_secret_here",
});

// Format numbers into standard INR currency representation (₹)
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Generate a sequential unique gym card number prefixed with 'FLF'
// Format: FLF + Last 2 digits of current year + 5-digit padded sequence number (e.g., FLF2600123)
export function generateCardNumber(sequenceNumber: number): string {
  const yearSuffix = new Date().getFullYear().toString().slice(-2);
  const paddedSeq = sequenceNumber.toString().padStart(5, "0");
  return `FLF${yearSuffix}${paddedSeq}`;
}
