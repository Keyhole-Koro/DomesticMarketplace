import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';
import { skills } from "./data";
import styles from "./AboutSection.module.css";

export function AboutSection() {
  const t = useTranslations('About');

  return (
    <section id="about" className={styles.aboutSection} aria-label="About section">
      <div className={styles.aboutIntro}>
        <p className={styles.kicker}>{t('kicker')}</p>
        <h2 className={styles.title}>{t('title')}</h2>
      </div>

      <div className={styles.browserMockup}>
        <div className={styles.browserHeader}>
          <div className={styles.dots}>
            <span className={styles.dotRed}></span>
            <span className={styles.dotYellow}></span>
            <span className={styles.dotGreen}></span>
          </div>
        </div>
        <div className={styles.profileContent}>
          <div className={styles.topGrid}>
            <div className={styles.profileCard}>
              <p className={styles.lead}>
                {t('lead')}
              </p>
              <div className={styles.actions}>
                <Link className={styles.primaryLink} href="/about">
                  {t('readMore')}
                </Link>
                <Link className={styles.secondaryLink} href="/contact">
                  {t('contact')}
                </Link>
              </div>
            </div>

            <div className={styles.imageCard}>
              <div className={styles.blobBlue}></div>
              <div className={styles.blobYellow}></div>
              <div className={styles.blobGreen}></div>

              <div className={styles.photoContainer}>
                <Image
                  src="/photo.png"
                  alt="Profile"
                  fill
                  className={styles.profileImage}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.skillsContainer}>
        <ul className={styles.skillsList} aria-label="Skills">
          {skills.map((skill) => (
            <li key={skill} className={styles.skillChip}>{skill}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
