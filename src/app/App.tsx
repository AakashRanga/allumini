import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { refreshAuthSessionActivity } from "@/lib/session";

export default function App() {
  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "touchstart"];
    const handleUserActivity = () => {
      refreshAuthSessionActivity();
    };

    events.forEach((event) => window.addEventListener(event, handleUserActivity));
    return () => events.forEach((event) => window.removeEventListener(event, handleUserActivity));
  }, []);

  return <RouterProvider router={router} />;
}
