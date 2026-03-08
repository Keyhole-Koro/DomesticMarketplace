import { useTranslations } from 'next-intl';
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>{t('copyright', { year })}</p>
    </footer>
  );
}
