import { Avatar } from "@radix-ui/react-avatar"
import Link from "next/link"
import { AvatarImage } from "../ui/avatar"
import { getUserSession } from "@/lib/auth"
import AvatarComponent from "../avatar"

const links = [
    {
        href:'/track',
        label:'Tracks'
    },
    {
        href:'/clients',
        label:'Clients'
    }
]

export default async function Navbar() {

    const user = await getUserSession();

  return (
    <div className="shadow">
        <div className="flex px-4 py-2 items-center">
            <div className="container flex items-center mx-auto space-x-4 py-4">
                <Link href='/'>EchoT</Link>

                <nav>
                    <ul className="flex gap-4">
                        {links.map(({href,label}) => (
                            <li key={label}>
                                <Link href={href}>{label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
        
                </div>
                <AvatarComponent user={user}/>
        </div>
    </div>
  )
}
