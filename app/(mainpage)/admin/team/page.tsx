import { getUserSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma";

const InviteLink = async() => {

  const user = await getUserSession();


  const tenant = await prisma.tenant.findUnique({
    where:{
      id:user.tenant.id
    }
  })

return ( 
  <div>
    <h2>Invite Link</h2>
    <input defaultValue={`http://localhost:3000/invite/${tenant?.inviteKey}`} className="w-full py-4 bg-neutral-300 rounded-sm cursor-pointer px-4" readOnly/>
  </div>
)}



export default function Team() {
  return (
    <div>
        <h1 className="text-3xl mb-4">Team</h1>
        <InviteLink/>
    </div>
  )
}
