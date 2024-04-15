"use client";
import type { ReactNode } from "react";
import r3f from "@/helpers/global";

export default function Three ({ children }:{children: ReactNode}) {
  return <r3f.In>{children}</r3f.In>;
};

