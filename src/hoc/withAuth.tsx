import { type ComponentType, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

export default function withAuth<Props extends object>(
  Component: ComponentType<Props>,
) {
  return function AuthenticatedComponent(props: Props) {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoggedIn) {
        navigate("/login", { replace: true });
      }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) return null;

    return <Component {...props} />;
  };
}
