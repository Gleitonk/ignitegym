import {
  createContext,
  ReactNode,
  useState,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";

import {
  saveUserInStorage,
  getUserFromStorage,
  removeUserFromStorage,
} from "@storage/stogareUser";
import {
  getUserTokenFromStorage,
  removeUserTokenFromStorage,
  saveUserTokenInStorage,
} from "@storage/stogareToken";

type AuthContextProps = {
  children: ReactNode;
};

export type AuthProviderDataProps = {
  user: UserDTO;
  setUser: Dispatch<SetStateAction<UserDTO>>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
  isLoadingStorageData: boolean;
};

const AuthContext = createContext<AuthProviderDataProps>(
  {} as AuthProviderDataProps
);

export function AuthContextProvider({ children }: AuthContextProps) {
  const [isLoadingStorageData, setIsLoadingStorageData] = useState(true);
  const [user, setUser] = useState<UserDTO>({} as UserDTO);

  async function signIn(email: string, password: string) {
    try {
      setIsLoadingStorageData(true);
      const { data } = await api.post("/sessions", { email, password });

      if (data.user && data.token) {
        updateUserAndTokenInApp(data.user, data.token);
        saveUserAndTokenInStorage(data.user, data.token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingStorageData(false);
    }
  }

  async function loadUserData() {
    try {
      const _user = await getUserFromStorage();
      const _token = await getUserTokenFromStorage();

      if (_user && _token) {
        updateUserAndTokenInApp(_user, _token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingStorageData(false);
    }
  }

  async function signOut() {
    try {
      setIsLoadingStorageData(true);

      setUser({} as UserDTO);
      await removeUserFromStorage();
      await removeUserTokenFromStorage();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingStorageData(false);
    }
  }

  async function updateUserAndTokenInApp(userData: UserDTO, token: string) {
    setUser(userData);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  async function saveUserAndTokenInStorage(userData: UserDTO, token: string) {
    try {
      await saveUserInStorage(userData);
      await saveUserTokenInStorage(token);
    } catch (error) {
      throw error;
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated);
      await saveUserInStorage(userUpdated);
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signIn,
        signOut,
        updateUserProfile,
        isLoadingStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
