import { getUserSession } from "@/lib/auth"

export default async function ProfilePage() {


    const user = await getUserSession()

  return (
    <div>
        <h1 className="text-4xl">Profile</h1>

            <div>{user.name}</div>
    </div>
  )
}
