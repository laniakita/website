'use client'

import { useDarkStore } from "@/providers/theme-store-provider";
import dynamic from "next/dynamic";

const DarkTheme = dynamic(() => import('./dark'));
const LightTheme = dynamic(() => import('./light'));

export default function DyanmicHighlighter() {
  const {dark} = useDarkStore((state) => state);
  return (
    <>
      {dark ? <DarkTheme /> : <LightTheme />}
    </>
  )
};