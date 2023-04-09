import * as SecureStore from "expo-secure-store";

import { AUTH_TOKEN_STORAGE } from "./storageConfig";

type StorageUserTokenProps = {
  token: string;
  refresh_token: string;
};

async function saveUserTokenInStorage({
  token,
  refresh_token,
}: StorageUserTokenProps) {
  await SecureStore.setItemAsync(
    AUTH_TOKEN_STORAGE,
    JSON.stringify({ token, refresh_token })
  );
}

async function getUserTokenFromStorage() {
  const storage = await SecureStore.getItemAsync(AUTH_TOKEN_STORAGE);

  const { token, refresh_token }: StorageUserTokenProps = storage
    ? JSON.parse(storage)
    : {};

  return { token, refresh_token };
}

async function removeUserTokenFromStorage() {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_STORAGE);
}

export {
  saveUserTokenInStorage,
  getUserTokenFromStorage,
  removeUserTokenFromStorage,
};
