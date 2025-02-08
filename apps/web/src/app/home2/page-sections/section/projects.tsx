'use client'

import { useRef } from "react";
import MiniProjectsRoller from "../../rollers/mini-projects-roller";
import { useIntersectionObserver } from "../../utils";

export default function Projects() {
  const menuRef = useRef<HTMLElement>(null!);
  const visible = useIntersectionObserver(menuRef);

  return (
    <menu ref={menuRef} className='flex w-full flex-row gap-6 overflow-x-auto overflow-y-hidden px-6 @min-[66rem]:px-20 pb-40'>
      <MiniProjectsRoller visible={visible} />
    </menu>
  );

}
