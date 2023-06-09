import { BASE_URL } from "./../../global-variables.js";

import { useState } from "react";

export default function useLogin() {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (user, password) => {
    setIsLoading(true);
    setError(false);

    let username, email;
    if (user.includes("@")) email = user;
    else username = user;

    const requestBody = {
      query: `mutation Login{login(displayName: "${username}", username: "${username}", email: "${email}", password: "${password}"){_id, displayName, path, roles}}`,
    }

    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();

    if (data.errors) {
      setIsLoading(false);
      setError(data.errors[0].message);
      return
    }

    setIsLoading(false);
    setError(false);
    localStorage.setItem("user", JSON.stringify(data.data.login));

    return data.data.login;
  };

  return { login, isLoading, error };
}
