import { useEffect } from "react";
import { getTokenExpiry } from "../utils/token";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function useAutoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const expiry = getTokenExpiry(token);
    if (!expiry) return;

    const timeout = expiry - Date.now();

    if (timeout <= 0) {
      logout(navigate);
      return;
    }

    const timer = setTimeout(() => {
      logout(navigate);
    }, timeout);

    return () => clearTimeout(timer);
  }, [navigate]);
}