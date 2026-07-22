import { projectData } from "@/data/projects";
import ProjectDetail from "@/sections/pages/ProjectDetail";

export function generateStaticParams() {
  return projectData.map((project) => ({ projectId: project.id }));
}

/** Allow admin/API project slugs that are not in the static list. */
export const dynamicParams = true;

export default async function Page({ params }) {
  const { projectId } = await params;
  return <ProjectDetail projectId={projectId} />;
}
