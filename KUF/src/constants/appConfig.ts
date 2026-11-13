/**
 * What happens when a QR code that is ALREADY registered is scanned again.
 *
 *  false (default) -> always show the red "already sold and registered to another user" page,
 *                     whoever scans it (customers open their own products from My Purchases).
 *  true            -> if the product belongs to the same customer (this device or the same phone
 *                     number), open its details page instead of the red page.
 */
export const OWNER_OPENS_DETAILS_ON_RESCAN = false;