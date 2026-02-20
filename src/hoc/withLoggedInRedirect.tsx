import { type ComponentType, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

export default function withLoggedInRedirect<Props extends object>(
  Component: ComponentType<Props>,
) {
  return function LoggedInRedirectComponent(props: Props) {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
      if (isLoggedIn) {
        navigate("/team", { replace: true });
      }
    }, [isLoggedIn, navigate]);

    if (isLoggedIn) return null;

    return <Component {...props} />;
  };
}
