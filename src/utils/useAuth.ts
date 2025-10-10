import { useEffect } from "react";
import { useRouter } from "next/router";

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("sessionUser");
    if (!session) {
      router.replace("/login"); // redirige si no hay sesión
    }
  }, [router]);
};
