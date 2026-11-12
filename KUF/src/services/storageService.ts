import { ProductDetails, hydrateProduct } from '../constants/productData';

export interface UserRegistration {
  name: string;
  email: string;
  phone: string;
  agreedToPolicy: boolean;
  registeredAt: string;
  serialNumber: string;
  /** Profile picture chosen on the Edit Profile page (small JPEG as a data URL) */
  photo?: string;
}

export interface SupportTicket {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  type: 'support' | 'feedback' | 'incident';
  createdAt: string;
}

const STORAGE_KEYS = {
  USER_DATA: 'dyrect_knownyou_user',
  REGISTERED_PRODUCTS: 'dyrect_knownyou_registered_products',
  CURRENT_PRODUCT: 'dyrect_knownyou_current_product',
  FAVORITES: 'dyrect_knownyou_favorites',
  PURCHASES_OWNER: 'dyrect_knownyou_purchases_owner',
  SUPPORT_TICKETS: 'dyrect_knownyou_tickets',
  LOCATION_PERMISSION: 'dyrect_knownyou_location_perm',
  INITIALIZED: 'dyrect_knownyou_init'
};

export const storageService = {
  getUser(): UserRegistration | null {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveUser(user: UserRegistration) {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },

  /** Edit Profile: changes only the given fields of the saved user. */
  updateUser(patch: Partial<Pick<UserRegistration, 'name' | 'email' | 'photo'>>): UserRegistration | null {
    const user = this.getUser();
    if (!user) return null;
    const next = { ...user, ...patch };
    this.saveUser(next);
    return next;
  },

  /** Sign in: remembers the customer on this device and loads their purchases. */
  signIn(customer: { name: string; email: string; phone: string }, purchases: ProductDetails[] = []) {
    this.mergeServerPurchases(customer.phone, purchases);
    this.saveUser({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      agreedToPolicy: true,
      registeredAt: new Date().toISOString(),
      serialNumber: ''
    });
  },

  /** Logout: forgets the user and everything saved for them on this device. */
  logout() {
    [
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.REGISTERED_PRODUCTS,
      STORAGE_KEYS.CURRENT_PRODUCT,
      STORAGE_KEYS.FAVORITES,
      STORAGE_KEYS.PURCHASES_OWNER
    ].forEach((key) => localStorage.removeItem(key));
  },

  registerProduct(product: ProductDetails, user: UserRegistration): boolean {
    this.saveUser(user);
    this.ensurePurchasesOwner(user.phone);
    const existing = this.getPurchases();
    if (!existing.some(p => p.id === product.id || p.serialNumber === product.serialNumber)) {
      existing.unshift(product);
      localStorage.setItem(STORAGE_KEYS.REGISTERED_PRODUCTS, JSON.stringify(existing));
    }
    this.setCurrentProduct(product);
    return true;
  },

  getPurchases(): ProductDetails[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_PRODUCTS);
    if (!raw) return [];
    try {
      return (JSON.parse(raw) as ProductDetails[]).map(hydrateProduct);
    } catch {
      return [];
    }
  },

  /** The product whose details / feedback / incident pages are currently open. */
  getCurrentProduct(): ProductDetails | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_PRODUCT);
    if (raw) {
      try {
        return hydrateProduct(JSON.parse(raw) as ProductDetails);
      } catch {
        /* fall through */
      }
    }
    return this.getPurchases()[0] || null;
  },

  setCurrentProduct(product: ProductDetails) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PRODUCT, JSON.stringify(product));
  },

  isProductRegistered(id: string): boolean {
    const purchases = this.getPurchases();
    return purchases.some(p => p.id === id || p.serialNumber === id);
  },

  getFavorites(): ProductDetails[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!raw) return [];
    try {
      return (JSON.parse(raw) as ProductDetails[]).map(hydrateProduct);
    } catch {
      return [];
    }
  },

  isFavorite(productId: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some(p => p.id === productId);
  },

  toggleFavorite(product: ProductDetails): boolean {
    const favorites = this.getFavorites();
    const idx = favorites.findIndex(p => p.id === product.id);
    let isNowFav = false;
    if (idx >= 0) {
      favorites.splice(idx, 1);
      isNowFav = false;
    } else {
      favorites.push(product);
      isNowFav = true;
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return isNowFav;
  },

  /** My Purchases belong to one phone number; a different number on the same device starts a fresh list. */
  ensurePurchasesOwner(phone: string) {
    const owner = localStorage.getItem(STORAGE_KEYS.PURCHASES_OWNER);
    if (owner && owner !== phone) {
      localStorage.removeItem(STORAGE_KEYS.REGISTERED_PRODUCTS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_PRODUCT);
    }
    localStorage.setItem(STORAGE_KEYS.PURCHASES_OWNER, phone);
  },

  /**
   * Puts every product registered with this phone number into My Purchases
   * (together with the ones already saved on this device), newest first.
   */
  mergeServerPurchases(phone: string, products: ProductDetails[]) {
    this.ensurePurchasesOwner(phone);
    const merged = [...this.getPurchases()];
    products.forEach((product) => {
      if (!merged.some((p) => p.serialNumber === product.serialNumber)) merged.push(product);
    });
    merged.sort((a, b) => String(b.registeredAt || '').localeCompare(String(a.registeredAt || '')));
    localStorage.setItem(STORAGE_KEYS.REGISTERED_PRODUCTS, JSON.stringify(merged));
  },

  addSupportTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt'>): SupportTicket {
    const ticketsRaw = localStorage.getItem(STORAGE_KEYS.SUPPORT_TICKETS);
    const tickets: SupportTicket[] = ticketsRaw ? JSON.parse(ticketsRaw) : [];
    const newTicket: SupportTicket = {
      ...ticket,
      id: `ticket_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    tickets.unshift(newTicket);
    localStorage.setItem(STORAGE_KEYS.SUPPORT_TICKETS, JSON.stringify(tickets));
    return newTicket;
  },

  getLocationPermission(): string | null {
    return localStorage.getItem(STORAGE_KEYS.LOCATION_PERMISSION);
  },

  setLocationPermission(status: 'allowed' | 'denied' | 'prompt') {
    localStorage.setItem(STORAGE_KEYS.LOCATION_PERMISSION, status);
  }
};