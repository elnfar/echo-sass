import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getUserSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"


const NewActivity = () => {
  return (
    <div>
      <h2>What are you working on ?</h2>

      <form>
        <div className="flex items-center mx-auto space-x-4">
        <Input name="name"/>
        <Button type="submit" value="submit">Start</Button>
        </div>
      </form>
      
    </div>
  )
}

export default async function TrackTimePage() {

  const user = await getUserSession()

  const currentActivity = await prisma.activity.findFirst({
    where: {
      tenantId: user.tenant.id,
      userId:user.id,     
      endAt:null
    }
  })

  return (
    <main  className="container py-4">
      <NewActivity/>
    </main>
  )
}
