import { projectData } from "@/data/projects";
import ProjectDetail from "@/sections/pages/ProjectDetail";

export function generateStaticParams() {
  return projectData.map((project) => ({ projectId: project.id }));
}

export default async function Page({ params }) {
  const { projectId } = await params;
  return <ProjectDetail projectId={projectId} />;
}
