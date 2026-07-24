import ProjectDetail from "@/sections/pages/ProjectDetail";

/** Project pages are loaded from the API at runtime. */
export const dynamicParams = true;
export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { projectId } = await params;
  return <ProjectDetail projectId={projectId} />;
}
