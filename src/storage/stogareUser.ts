import * as SecureStore from "expo-secure-store";

import { UserDTO } from "@dtos/UserDTO";
import { USER_STORAGE } from "./storageConfig";

async function saveUserInStorage(user: UserDTO) {
  await SecureStore.setItemAsync(USER_STORAGE, JSON.stringify(user));
}

async function getUserFromStorage() {
  const storage = await SecureStore.getItemAsync(USER_STORAGE);

  const user: UserDTO = storage ? JSON.parse(storage) : ({} as UserDTO);
  return user;
}

async function removeUserFromStorage() {
  await SecureStore.deleteItemAsync(USER_STORAGE);
}

export { saveUserInStorage, getUserFromStorage, removeUserFromStorage };