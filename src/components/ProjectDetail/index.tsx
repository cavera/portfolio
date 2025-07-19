import { Project } from "@/types/project";

interface ProjectDetailProps {
    project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
    return (
        <div>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            {/* Add more project details as needed */}
        </div>
    );
} 