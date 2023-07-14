'use client'
import { Avatar } from "@radix-ui/react-avatar"
import Link from "next/link"
import { AvatarImage } from "../ui/avatar"


const links = [
    {
        href:'/track',
        label:'Tracks'
    }
]

export default function Navbar({user}:any) {

    
    

  return (
    <div className="shadow">
        <div className="flex px-4 py-2 items-center">
            <div className="container flex items-center mx-auto space-x-4 py-4">
                <Link href='/'>EchoT</Link>

                <nav>
                    <ul>
                        {links.map(({href,label}) => (
                            <li>
                                <Link href={href}>{label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
        
                </div>
                    <Avatar className="">
                        <AvatarImage className="w-[50px] h-[50px] rounded-full" src={user.image} referrerPolicy="no-referrer"/>
                    </Avatar>
        </div>
    </div>
  )
}
