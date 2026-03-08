"use client";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { ConfettiBg } from "@/components/ConfettiBg";
import { TopNav } from "@/components/landing/TopNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import styles from "./page.module.css";

const SKILL_CATEGORIES = [
  {
    titleKey: "engineering",
    icon: "code",
    skills: ["React", "Node.js", "Next.js", "TypeScript", "HTML & CSS", "Python", "C", "Security Management", "Unity"],
  },
  {
    titleKey: "design",
    icon: "brush",
    skills: ["Figma", "Illustrator", "Photoshop", "Premiere Pro & After Effects"],
  },
  {
    titleKey: "tools",
    icon: "build",
    skills: ["Git & GitHub", "Vercel", "Podcasting", "System Architecture", "Electronic Circuit Design"],
  },
];

export default function AboutPage() {
  const t = useTranslations('AboutPage');
  const locale = useLocale();

  // We can't easily map the experiences if they are in the JSON as an array
  // because next-intl returns a raw array for .raw().
  // However, it's better to use t.raw('experience.items') if we want to iterate.
  const experiences = t.raw('experience.items') as any[];

  return (
    <main className={styles.page}>
      <ConfettiBg />
      <TopNav />

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          {t('hero.title1')}<br />
          {t('hero.title2')}
        </h1>
        <div className={styles.ctaGroup}>
          <p className={styles.ctaHint}>{t('hero.subtitle')}</p>
        </div>
      </section>

      <section className={styles.browserMockup}>
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
              <h2 className={styles.profileName}>{t('profile.name')}</h2>
              <div className={styles.profileDetails}>
                <p>{t('profile.location')}</p>
                <p>{t('profile.role')}</p>
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

          <div className={styles.bottomCard}>
            <div className={styles.bottomContent}>
              <p className={styles.philosophyText}>
                {t('profile.philosophy')}
              </p>

              <Link className={styles.contactBtn} href="/contact">
                {t('profile.contact')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section (Organic) */}
      <section className={styles.organicSection}>
        <div className={styles.profileContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t('experience.title')}</h2>
          </div>
          <div className={styles.timeline}>
            {experiences.map((exp, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelinePoint}></div>
                <div className={styles.timelineContent}>
                  <span className={styles.timelineDate}>{exp.period}</span>
                  <h3 className={styles.timelineRole}>{exp.role}</h3>
                  <p className={styles.timelineDesc}>
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section (Material Icon Cards) */}
      <section className={styles.organicSection}>
        <div className={styles.profileContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t('skills.title')}</h2>
          </div>
          <div className={styles.skillsGrid}>
            {SKILL_CATEGORIES.map((category, index) => (
              <div key={index} className={styles.skillCategory}>
                <div className={styles.skillHeader}>
                  <span className="material-symbols-outlined">{category.icon}</span>
                  <h3 className={styles.skillCategoryTitle}>{t(`skills.categories.${category.titleKey}` as any)}</h3>
                </div>
                <div className={styles.skillChips}>
                  {category.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className={styles.skillChip}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Links & Contact CLI Window */}
      <section className={`${styles.browserMockup} ${styles.terminalWindow}`}>
        <div className={`${styles.browserHeader} ${styles.terminalHeader}`}>
          <div className={styles.dots}>
            <span className={styles.dotRed}></span>
            <span className={styles.dotYellow}></span>
            <span className={styles.dotGreen}></span>
          </div>
          <p className={styles.terminalTitle}>kota@portfolio:~</p>
        </div>
        <div className={`${styles.profileContent} ${styles.terminalContent}`}>
          <div className={styles.terminalText}>
            <p><span className={styles.prompt}>kota@portfolio:~$</span> ls -la ~/links</p>
            <div className={styles.cliLinks}>
              <p>-rw-r--r--   <Link href="https://github.com/Buchi-dev-dzn" target="_blank" className={styles.cliLink}>github.com</Link></p>
              <p>-rw-r--r--   <Link href="https://x.com/buchii___" target="_blank" className={styles.cliLink}>x.com</Link></p>
              <p>-rw-r--r--   <Link href="https://www.linkedin.com/in/kota-mizobuchi/" target="_blank" className={styles.cliLink}>linkedin.com</Link></p>
            </div>
            <p><span className={styles.prompt}>kota@portfolio:~$</span> cat email.txt</p>
            <p className={styles.cliEmail}>kmc2438@kamiyama.ac.jp</p>
            <p><span className={styles.prompt}>kota@portfolio:~$</span> <span className={styles.cursor}>_</span></p>
          </div>
        </div>
      </section>

      {/* Copy Email Button */}
      <div className={styles.copyContainer}>
        <CopyEmailButton />
      </div>

      <SiteFooter />
    </main>
  );
}
