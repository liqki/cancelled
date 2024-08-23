"use client";

import { createContext, FC, ReactNode, useEffect, useState } from "react";

type UserContextType = {
  id: string;
  setId: (id: string) => void;
  name: string;
  setName: (name: string) => void;
  color: string;
  setColor: (color: string) => void;
};

export const UserContext = createContext<UserContextType>({
  id: "",
  setId: () => {},
  name: "",
  setName: () => {},
  color: "",
  setColor: () => {},
});

export const UserContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    setName(localStorage.getItem("name") || "");
    setColor(localStorage.getItem("color") || `#${Math.floor(Math.random() * 16777215).toString(16)}`);
  }, []);

  useEffect(() => {
    if (name) localStorage.setItem("name", name);
    if (color) localStorage.setItem("color", color);
  }, [name, color]);

  return <UserContext.Provider value={{ id, setId, name, setName, color, setColor }}>{children}</UserContext.Provider>;
};
