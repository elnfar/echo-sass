import { Button } from "@/components/ui/button"
import { Client } from "@prisma/client"
import Link from "next/link"


type ClientListProps = {
    clients: Client[]
  }
  
export const ClientList = ({clients}:ClientListProps) => {
    return (
      <ul className="flex flex-col gap-5">
        {clients.map((client) => (
          <li key={client.id} className=" flex items-center gap-7">
            <Link className="text-[2rem]" href={`/clients/${client.id}`}>{client.name}</Link>
            <p className=" text-neutral-600 text-xs">click to manage the client</p>
            </li>
        ))}
      </ul>
    )
  }
  

  export const ClientListHeader = () => {
    return (
      <div className="flex gap-4 items-center">
        <h2 className="text-lg font-medium mb-2">Clients</h2>
        <Button asChild>
          <Link href="/clients/new">Create</Link>
        </Button>
      </div>
    )
  }