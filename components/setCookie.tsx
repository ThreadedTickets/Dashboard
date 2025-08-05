"use client";

import { useEffect } from "react";

export default function SetCookie({ cookie }: { cookie: string }) {
  useEffect(() => {
    document.cookie = cookie;
  }, [cookie]);

  return <></>;
}
