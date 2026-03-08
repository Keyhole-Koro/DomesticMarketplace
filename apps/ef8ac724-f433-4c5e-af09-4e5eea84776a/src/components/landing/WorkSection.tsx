import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { featuredProjects, WorkProjectGrid } from "@/features/work";
import styles from "./WorkSection.module.css";

export function WorkSection() {
  const t = useTranslations('WorkSection');

  return (
    <section id="work" className={styles.workSection} aria-label="Work section">
      <header className={styles.workHeader}>
        <p className={styles.workKicker}>{t('kicker')}</p>
        <h2 className={styles.workTitle}>{t('title')}</h2>
        <p className={styles.workLead}>
          {t('lead')}
        </p>
        <div className={styles.actions}>
          <Link className={styles.primaryLink} href="/work">
            {t('links.discuss')}
          </Link>
        </div>
      </header>

      <WorkProjectGrid projects={featuredProjects} ctaLabel={t('cta')} />
    </section>
  );
}
