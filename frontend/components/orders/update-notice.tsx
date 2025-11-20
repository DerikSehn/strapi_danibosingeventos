"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function UpdateNotice() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) return;
    const updated = params.get("updated");
    const error = params.get("error");
    if (updated) {
      toast.success("Pedido atualizado");
      shown.current = true;
      router.replace(pathname);
    } else if (error) {
      toast.error(decodeURIComponent(error));
      shown.current = true;
      router.replace(pathname);
    }
  }, [params, pathname, router]);

  return null;
}
