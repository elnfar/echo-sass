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
                    <li key={project.id}>
                        <Link href={`/projects/${project.id}`}>{project.name}</Link>
                    </li>
                ))
            }
        </ul>
    )
}