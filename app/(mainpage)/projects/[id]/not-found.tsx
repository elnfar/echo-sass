import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div>
      <h2>Not Found the Path you searched.</h2>
      <p>Could not find requested resource</p>
      <p>
        View <Link href="/projects">Projects</Link>
      </p>
    </div>
  )
}