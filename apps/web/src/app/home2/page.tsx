'use client'

import dynamic from "next/dynamic";

const ThreePage = dynamic(()=> import( "./three-page").then((mod) => mod.ThreePage), {ssr: false});

export default function HomeV2() {
  return (
    <ThreePage />
  );
}
