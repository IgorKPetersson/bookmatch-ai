import { createContext, useState } from "react";

import React from "react";

export const AuthContext = createContext();

export default function AuthProvider(props) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  function logout() {
    setToken(null);
    localStorage.removeItem("token");
  }
  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}
