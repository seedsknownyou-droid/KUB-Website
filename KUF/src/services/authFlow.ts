import { apiService, AuthCustomer } from './apiService';
import { storageService } from './storageService';
import { buildProduct } from '../constants/productData';

/**
 * Called after the SMS code was accepted: remembers the customer on this device
 * and loads the products registered with this phone number (My Purchases).
 */
export async function finishSignIn(customer: AuthCustomer): Promise<void> {
  let purchases: ReturnType<typeof buildProduct>[] = [];
  try {
    const res = await apiService.getCustomerProducts(customer.phone);
    purchases = res.products.map((p) => buildProduct(p.serialNumber, p.productName, p.registeredAt));
  } catch {
    // Signing in still works; the purchases list refreshes the next time it is opened
  }
  storageService.signIn(customer, purchases);
}

export const isValidPhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);
export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);