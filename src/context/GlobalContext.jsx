import React, { createContext, useContext, useState } from "react";

// 1. Create context
const GlobalContext = createContext();

// 2. Provider
export const GlobalProvider = ({ children }) => {
  const [country, setCountry] = useState({ en: "egypt", ar: "مصر" });

  return (
    <GlobalContext.Provider value={{ country, setCountry }}>
      {children}
    </GlobalContext.Provider>
  );
};

// 3. Custom hook (optional)
export const useGlobal = () => useContext(GlobalContext);
