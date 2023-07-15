'use client';

import { Session } from "next-auth";
import { Avatar, AvatarImage } from "./ui/avatar";

export default function AvatarComponent({user}:{user:Session['user']}) {
  return (
    <Avatar className="">
        {user.image && (
         <AvatarImage className="w-[50px] h-[50px] rounded-full" src={user.image} referrerPolicy="no-referrer"/>
        )}
    </Avatar>   
  )
}
