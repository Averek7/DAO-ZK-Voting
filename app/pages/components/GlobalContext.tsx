import { createContext, useContext, useState, ReactNode } from "react";

interface GlobalContextProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;

  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({
  children,
}): ReactNode => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <GlobalContext.Provider
      value={{ title, setTitle, description, setDescription }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
