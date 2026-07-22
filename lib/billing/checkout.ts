export type AttachCheckoutResult = {
  paymentUrl?: string | null;
};

export async function redirectToCheckout(
  result: AttachCheckoutResult | null | undefined
): Promise<boolean> {
  if (result?.paymentUrl) {
    window.location.href = result.paymentUrl;
    return true;
  }
  return false;
}

export function checkoutSuccessUrl(path = "/account"): string {
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}
