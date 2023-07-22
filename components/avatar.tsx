'use client';

import { Session } from "next-auth";
import { Avatar, AvatarImage } from "./ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import Logout from "./ui/logout";

export default function AvatarComponent({user}:{user:Session['user']}) {
  return (
    <div>
    <DropdownMenu>
      <DropdownMenuTrigger>
      <Avatar className=" flex items-center justify-center">
        {user.image && (
         <AvatarImage className="w-[50px] h-[50px] rounded-full flex items-center justify-center" src={user.image} referrerPolicy="no-referrer"/>
        )}
    </Avatar>  
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-6">
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="w-full cursor-pointer">
          <Link href='/profile'>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <Logout/>
      </DropdownMenuContent>
</DropdownMenu>
</div>
   
  )
}
