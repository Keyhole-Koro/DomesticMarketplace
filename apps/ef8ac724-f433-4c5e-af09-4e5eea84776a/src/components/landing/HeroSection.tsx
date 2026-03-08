import { useTranslations } from 'next-intl';
import Image from 'next/image';
import styles from "./HeroSection.module.css";

export function HeroSection() {
  const t = useTranslations('Hero');

  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>
        {t('title')}
      </h1>
      <div className={styles.ctaGroup}>
        <p className={styles.ctaHint}>{t('subtitle')}</p>
      </div>
    </section>
  );
}
