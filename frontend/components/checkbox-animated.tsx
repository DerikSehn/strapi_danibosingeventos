"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface CheckboxAnimatedProps {
  id?: string;
    className?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export default function CheckboxAnimated({ 
  id, 
   className,
  checked,
  onCheckedChange
}: CheckboxAnimatedProps) {
   

  const handleChange = () => {
        onCheckedChange?.(!checked);
    };


  return (
    <label className={cn("relative block h-[1.5rem] w-[1.5rem] cursor-pointer rounded-sm outline-2 outline-offset-1 outline-gray-700 has-[:focus-visible]:outline", className)}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="peer absolute h-0 w-0 opacity-0"
      />
      <div className="block h-[inherit] w-[inherit] rounded-md border-[2px] border-black transition-all duration-300 peer-checked:ml-1 peer-checked:h-5 peer-checked:w-3 peer-checked:translate-x-[2px] peer-checked:translate-y-[-1px] peer-checked:rotate-45 peer-checked:rounded-none peer-checked:border-b-[2px] peer-checked:border-l-transparent peer-checked:border-t-transparent dark:border-white"></div>
    </label>
  )
}