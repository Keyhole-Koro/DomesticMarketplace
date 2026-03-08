import { Link } from "@/i18n/routing";
import { useLocale } from 'next-intl';
import type { WorkProject } from "../types";
import styles from "./WorkProjectCard.module.css";

type WorkProjectCardProps = {
  project: WorkProject;
  ctaLabel?: string;
};

export function WorkProjectCard({ project, ctaLabel = "View Case →" }: WorkProjectCardProps) {
  const locale = useLocale() as 'en' | 'ja';

  const title = project.title[locale];
  const type = project.type[locale];
  const summary = project.summary[locale];

  return (
    <Link className={styles.card} href={project.href as any}>
      {project.image && (
        <div className={styles.imageWrapper}>
          <img src={project.image} alt={title} className={styles.image} />
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.meta}>
          <p className={styles.type}>{type}</p>
          <p className={styles.year}>{project.year}</p>
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.summary}>{summary}</p>
        <ul className={styles.tags} aria-label={`${title} technologies`}>
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <span className={styles.link}>
          {ctaLabel}
        </span>
      </div>
    </Link>
  );
}
