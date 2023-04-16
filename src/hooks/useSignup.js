import { useState } from "react";

export default function useSignup() {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (displayName, email, password) => {
    setIsLoading(true);
    setError(false);

    const requestBody = {
      query: `mutation Signup{signup(displayName: "${displayName}", email: "${email}", password: "${password}"){_id, displayName, path}}`,
    }

    const res = await fetch("https://next-forum-server.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();

    if (data.errors) {
      setIsLoading(false);
      setError(data.errors[0].extensions.originalError ? data.errors[0].extensions.originalError.message : data.errors[0].message);
      return
    }

    setIsLoading(false);
    setError(false);
    // save the user to local storage
    localStorage.setItem("user", JSON.stringify(data.data.signup));

    return data.data.signup;
  };

  return { signup, isLoading, error };
}
