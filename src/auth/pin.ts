import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'ece_evreni_admin_pin';

export const hasPinSet = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(PIN_KEY);
  return value !== null;
};

export const setPin = async (pin: string): Promise<void> => {
  await SecureStore.setItemAsync(PIN_KEY, pin);
};

export const verifyPin = async (pin: string): Promise<boolean> => {
  const stored = await SecureStore.getItemAsync(PIN_KEY);
  return stored !== null && stored === pin;
};

// Not wired into any UI yet — kept for a future "PIN'i sıfırla" admin
// action if Ece's parents ever need to change it.
export const clearPin = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(PIN_KEY);
};
