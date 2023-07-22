'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"




type SideBarListProps = {
    href:string,
    label:string
}


export default function SideBarList({href,label}:SideBarListProps) {

    const pathname = usePathname();

  return (
    <li key={href}>
        <Link className={cn(' w-full block hover:bg-neutral-600 rounded-md p-4 transition-all hover:text-white',{
            'bg-neutral-100':href.startsWith(pathname)
        })} href={href}>{label}</Link>   
    </li>
  )
}
