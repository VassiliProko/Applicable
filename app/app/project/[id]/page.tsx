import { projects } from "@/app/lib/mock-data";
import Navbar from "@/app/components/Navbar";
import ProjectDashboard from "@/app/components/ProjectDashboard";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <ProjectDashboard project={project} />
    </div>
  );
}
