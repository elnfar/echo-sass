'use client'

import { useEffect, useState } from "react"

type Props = {
    startAt:Date
}


const pad = (n:number) => n.toString().padStart(2,'0');

export default function Duration({startAt}:Props) {


    const now = new Date();
    const [elapsed,setElapsed] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            // const date = new Date(startAt);
            const elapsed = now.getTime() - startAt.getTime();
            setElapsed(elapsed)
        }, 1000);

        return () => clearInterval(interval);
    })

    
    const hours = Math.floor(elapsed / 1000 / 60 / 60);
    const minutes = Math.floor((elapsed / 1000 / 60) % 60)
    const seconds = Math.floor((elapsed / 1000) % 60)
  return (
    <div className="slashed-zero tabular-nums font-semibold">{pad(hours)}:{pad(minutes)}:{pad(seconds)}</div>
  )
}
