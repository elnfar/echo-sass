import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


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

export default function Home() {
  return (
    <main  className="container py-4">
      <NewActivity/>
    </main>
  )
}
