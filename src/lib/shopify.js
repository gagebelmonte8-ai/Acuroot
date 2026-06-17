// Shopify integration via cart permalinks — no API token or backend needed.
// A permalink like  https://shop.myshopify.com/cart/VARIANT:QTY,VARIANT:QTY
// adds the items and drops the shopper straight into Shopify's hosted checkout.

export const SHOP_DOMAIN =
  import.meta.env.VITE_SHOPIFY_DOMAIN || 'jjf1tr-dt.myshopify.com'

// Live variant IDs (public — they appear in cart URLs). Keyed by `${Color}-${qtyTier}`.
// Generated from the "Acuroot Acupressure Set" product on the connected store.
export const VARIANTS = {
  'Gold-1': '55049896919332',
  'Gold-2': '55049896952100',
  'Gold-3': '55049896984868',
  'Purple-1': '55049897017636',
  'Purple-2': '55049897050404',
  'Purple-3': '55049897083172',
  'Yellow-1': '55049897115940',
  'Yellow-2': '55049897148708',
  'Yellow-3': '55049897181476',
  'Gray-1': '55049897214244',
  'Gray-2': '55049897247012',
  'Gray-3': '55049897279780',
}

// "Acuroot Care — 30-Day Protection" ($5) add-on variant.
export const CARE_VARIANT = '55049905537316'

// Wired to a real store, so checkout is always live.
export const shopifyConfigured = true

/**
 * Build a Shopify cart permalink from cart lines.
 * @param {{variantId: string, quantity: number}[]} lines
 * @returns {string} checkout URL
 */
export function cartUrl(lines) {
  const path = lines
    .filter((l) => l.variantId)
    .map((l) => `${l.variantId}:${l.quantity}`)
    .join(',')
  return `https://${SHOP_DOMAIN}/cart/${path}`
}
