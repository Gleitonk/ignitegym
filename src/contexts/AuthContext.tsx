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

type AuthContextProps = {
  children: ReactNode;
};

export type AuthProviderDataProps = {
  user: UserDTO;
  setUser: Dispatch<SetStateAction<UserDTO>>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
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
      const { data } = await api.post("/sessions", { email, password });

      if (data.user) {
        setUser(data.user);
        saveUserInStorage(data.user);
      }
    } catch (error) {
      throw error;
    }
  }

  async function loadUserData() {
    try {
      const _user = await getUserFromStorage();

      if (_user) {
        setUser(_user);
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

      removeUserFromStorage();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingStorageData(false);
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
        isLoadingStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
