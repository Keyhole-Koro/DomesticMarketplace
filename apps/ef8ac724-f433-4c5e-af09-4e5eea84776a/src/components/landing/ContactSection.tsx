import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';
import styles from "./ContactSection.module.css";

export function ContactSection() {
  const t = useTranslations('Contact');
  const tp = useTranslations('ContactPage');

  return (
    <section id="contact" className={styles.contactSection} aria-label="Contact section">
      <div className={styles.minimalContainer}>
        <div className={styles.blobSystem}>
          <div className={styles.blobOrange}></div>
          <div className={styles.blobBlue}></div>
        </div>

        <div className={styles.content}>
          <p className={styles.kicker}>{t('kicker')}</p>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.lead}>
            {t('lead')}
          </p>

          <div className={styles.actions}>

            <div className={styles.buttonGroup}>
              <Link className={styles.primaryBtn} href="/contact">
                {tp('profile.checkOut')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
