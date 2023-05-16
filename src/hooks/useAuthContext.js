import { useContext } from "react";

import { AuthContext } from "./../context/AuthContext.js";

export default function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside an AuthContextProvider!");
  }

  return context;
}
