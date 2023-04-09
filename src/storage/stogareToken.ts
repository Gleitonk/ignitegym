import * as SecureStore from "expo-secure-store";

import { AUTH_TOKEN_STORAGE } from "./storageConfig";

async function saveUserTokenInStorage(token: string) {
  await SecureStore.setItemAsync(AUTH_TOKEN_STORAGE, token);
}

async function getUserTokenFromStorage() {
  const token = await SecureStore.getItemAsync(AUTH_TOKEN_STORAGE);
  return token;
}

async function removeUserTokenFromStorage() {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_STORAGE);
}

export {
  saveUserTokenInStorage,
  getUserTokenFromStorage,
  removeUserTokenFromStorage,
};
