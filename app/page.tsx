import { getUserSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Calendar from "./Calendar"



export default async function page() {

  const user = await getUserSession()

  const activity = prisma.activity.findMany({
    where: {
      tenantId:user.tenant.id,
    }
  })

  return (
    <div>

    </div>
  )
}
