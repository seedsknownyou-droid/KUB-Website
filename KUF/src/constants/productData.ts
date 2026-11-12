import papayaImage from '../assets/images/papaya.jpg';
import papayaCutout from '../assets/images/papaya-cutout.png';
import muskmelonImage from '../assets/images/muskmelon.jpg';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductDetails {
  /** Which catalog entry this product uses (images, specs, videos). Resolved again on every read. */
  catalogKey?: string;
  id: string;
  serialNumber: string;
  name: string;
  variety: string;
  registeredOn: string;
  registeredDateFormatted: string;
  companyName: string;
  description: string;
  features: string[];
  images: string[];
  videos: YouTubeVideo[];
  /** ISO time of registration (used to sort My Purchases, newest first) */
  registeredAt?: string;
  /** Main product photo (details page, favorites, register page) */
  heroImage: string;
  /** Transparent version of the photo for coloured backgrounds (register page header) */
  cutoutImage?: string;
  /** What "Read online reviews" searches for on Google */
  reviewsSearchQuery?: string;
  /** Size of the small photo in the My Purchases list, in px */
  thumbSize: { width: number; height: number };
  /** Specifications table (shown instead of the description for some products) */
  specifications?: ProductSpec[];
  showReviews: boolean;
  showInstagram: boolean;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  youtubeUrl: string;
  /** Paste the real YouTube video id here (e.g. 'abc123XYZ_-') to show the real embedded player. */
  youtubeId?: string;
  videoType: 'alert' | 'success' | 'harvesting' | 'yield';
}

export const DEFAULT_PRODUCT: ProductDetails = {
  catalogKey: "papaya-red-lady",
  heroImage: papayaImage,
  cutoutImage: papayaCutout,
  reviewsSearchQuery: "known you seed india",
  thumbSize: { width: 70, height: 65 },
  showReviews: true,
  showInstagram: true,
  id: "PRI01329327",
  serialNumber: "PRI01329327",
  name: "Papaya Red Lady",
  variety: "Red Lady 786",
  registeredOn: "06 Sep 2026",
  registeredDateFormatted: "September 6th, 2026",
  companyName: "Known-You Seed (India) Pvt. Ltd.",
  description:
    "Plant is early, vigorous & productive. Plants begin to bear fruit at 60-80 cm height and have over 30 fruits per plant in each fruit-setting season. Fruits are short oblong on female plants and rather long-shaped on bisexual plants, weighing about 1.5 - 2 kg. Flesh is thick, red, with 13% brix and aromatic. It has good shelf life & transportability.",
  features: [
    "Early, vigorous & highly productive",
    "Bears fruit at 60-80 cm height",
    "Over 30 fruits per plant in each fruit-setting season",
    "Fruit weight: 1.5 - 2 kg with 13% brix sweetness",
    "Thick, aromatic red flesh with excellent shelf life"
  ],
  images: [
    "papaya_basket_hero",
    "papaya_sliced_detail"
  ],
  // Real YouTube videos. To change one, replace its youtubeId (the part after youtu.be/ or v= in the link).
  videos: [
    {
      id: "vid-1",
      title: "Farmer Alert: Why You Should ONLY Buy from Authorized Nurseries!",
      channel: "Known-You Seed (India) Pvt. Ltd.",
      duration: "4:51",
      youtubeUrl: "https://youtu.be/sh_UWtP52tM",
      youtubeId: "sh_UWtP52tM",
      videoType: "alert"
    },
    {
      id: "vid-2",
      title: "Red Lady 786 पपीता खेती और सफल किसान की कहानी",
      channel: "Known-You Seed (India) Pvt. Ltd.",
      duration: "6:20",
      youtubeUrl: "https://youtu.be/RJ3IiJhtY9Q",
      youtubeId: "RJ3IiJhtY9Q",
      videoType: "success"
    },
    {
      id: "vid-3",
      title: "पपीता खेती और हार्वेस्टिंग | रेड लेडी 786",
      channel: "Known-You Seed (India) Pvt. Ltd.",
      duration: "5:12",
      youtubeUrl: "https://youtu.be/mqaRfb01-hA",
      youtubeId: "mqaRfb01-hA",
      videoType: "harvesting"
    },
    {
      id: "vid-4",
      title: "रेड लेडी 786 पपीता खेती – ज्यादा उत्पादन, मीठा स्वाद",
      channel: "Known-You Seed (India) Pvt. Ltd.",
      duration: "7:45",
      youtubeUrl: "https://youtu.be/R3ro4WwpKe4",
      youtubeId: "R3ro4WwpKe4",
      videoType: "yield"
    },
    {
      id: "vid-5",
      title: "Red Lady 786 पपीता खेती में सफलता",
      channel: "Known-You Seed (India) Pvt. Ltd.",
      duration: "6:02",
      youtubeUrl: "https://youtu.be/8z5w6UvQ4vI",
      youtubeId: "8z5w6UvQ4vI",
      videoType: "yield"
    }
  ]
};

export const MUSKMELON_PRODUCT: ProductDetails = {
  catalogKey: "muskmelon-bobby",
  heroImage: muskmelonImage,
  thumbSize: { width: 92, height: 69 },
  showReviews: false,
  showInstagram: false,
  id: "ML81101843",
  serialNumber: "ML81101843",
  name: "Muskmelon - Bobby",
  variety: "Bobby",
  registeredOn: "06 Sep 2026",
  registeredDateFormatted: "September 6th, 2026",
  companyName: "Known-You Seed (India) Pvt. Ltd.",
  description: "",
  features: [],
  images: [],
  videos: [],
  // Texts are copied exactly as shown in the real app
  specifications: [
    { label: "Fruit Shape", value: "Round" },
    { label: "Fruit Weight", value: "0.8-0.12 Kg" },
    { label: "Flesh Color", value: "Yellowish- White" },
    { label: "Brix", value: "16-19" },
    { label: "Sowing to Harvest", value: "70-80 days" }
  ]
};

/** All products the app knows. To add another product, add it here and in findCatalogProduct(). */
export const PRODUCT_CATALOG: ProductDetails[] = [DEFAULT_PRODUCT, MUSKMELON_PRODUCT];

const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Finds the catalog entry for a product, first by the exact name stored in Firebase
 * ("Muskmelon - Bobby"), then by the serial-number prefix (ML... / PRI...).
 */
export function findCatalogProduct(productName?: string, serialNumber?: string, catalogKey?: string): ProductDetails {
  if (catalogKey) {
    const byKey = PRODUCT_CATALOG.find((p) => p.catalogKey === catalogKey);
    if (byKey) return byKey;
  }
  if (productName) {
    const n = norm(productName);
    const byName = PRODUCT_CATALOG.find((p) => norm(p.name) === n);
    if (byName) return byName;
  }
  const sn = (serialNumber || '').toUpperCase();
  if (sn.startsWith('ML')) return MUSKMELON_PRODUCT;
  return DEFAULT_PRODUCT;
}

/**
 * Re-applies the fixed catalog data (photo, specs, videos...) to a product that was saved earlier,
 * so images always work even after the app is rebuilt.
 */
export function hydrateProduct(saved: ProductDetails): ProductDetails {
  const base = findCatalogProduct(saved.name, saved.serialNumber, saved.catalogKey);
  return {
    ...base,
    id: saved.id,
    serialNumber: saved.serialNumber,
    name: saved.name || base.name,
    registeredOn: saved.registeredOn,
    registeredDateFormatted: saved.registeredDateFormatted,
    registeredAt: saved.registeredAt
  };
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function ordinal(day: number): string {
  if (day >= 11 && day <= 13) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
}

/**
 * Builds the full product page data from what the server returns
 * (serial number, product name, registration time) plus the static
 * description / videos / features that are already in this file.
 */
export function buildProduct(
  serialNumber: string,
  productName: string | undefined,
  registeredAtIso: string | null | undefined
): ProductDetails {
  const date = registeredAtIso ? new Date(registeredAtIso) : new Date();
  const d = Number.isNaN(date.getTime()) ? new Date() : date;

  const base = findCatalogProduct(productName, serialNumber);

  return {
    ...base,
    id: serialNumber,
    serialNumber,
    name: productName || base.name,
    registeredAt: Number.isNaN(d.getTime()) ? undefined : d.toISOString(),
    registeredOn: `${String(d.getDate()).padStart(2, '0')} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`,
    registeredDateFormatted: `${MONTHS_LONG[d.getMonth()]} ${ordinal(d.getDate())}, ${d.getFullYear()}`
  };
}