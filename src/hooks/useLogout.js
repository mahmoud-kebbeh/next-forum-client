import useAuthContext from "./useAuthContext.js";

export default function useLogout() {
  const { dispatch } = useAuthContext();

  const logout = () => {
    localStorage.removeItem("user");

    window.document.cookie = `authorization=""; Max-Age=1; path=/`;

    dispatch({ type: "LOGOUT" });
  };

  return { logout };
}
