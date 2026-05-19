import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getAuthSession, isAuthSessionValid, logout } from "@/lib/session";

export function useSessionCheck(requiredRole?: "admin" | "alumni") {
  const navigate = useNavigate();

  useEffect(() => {
    const session = getAuthSession();

    if (!isAuthSessionValid(session, requiredRole)) {
      logout();
      navigate("/auth");
    }
  }, [navigate, requiredRole]);
}