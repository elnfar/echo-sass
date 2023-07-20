import { Project } from "@prisma/client"
import Link from "next/link"

type ProjectProps = {
    projects:Project[]
}

export const ProjectList = ({projects}:ProjectProps) => {
    return (
        <ul>
            {
                projects.map((project) => (
                    <li>
                        <Link href={`/projects/${project.id}`}>{project.name}</Link>
                    </li>
                ))
            }
        </ul>
    )
}