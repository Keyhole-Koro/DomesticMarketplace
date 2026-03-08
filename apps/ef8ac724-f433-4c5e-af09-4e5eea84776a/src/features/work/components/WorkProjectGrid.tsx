import type { WorkProject } from "../types";
import { WorkProjectCard } from "./WorkProjectCard";
import styles from "./WorkProjectGrid.module.css";

type WorkProjectGridProps = {
  projects: WorkProject[];
  ctaLabel?: string;
};

export function WorkProjectGrid({ projects, ctaLabel }: WorkProjectGridProps) {
  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <WorkProjectCard key={project.id} project={project} ctaLabel={ctaLabel} />
      ))}
    </div>
  );
}
