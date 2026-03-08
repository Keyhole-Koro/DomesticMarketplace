"use client";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ConfettiBg } from "@/components/ConfettiBg";
import { TopNav } from "@/components/landing/TopNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import styles from "./page.module.css";

export default function ContactPage() {
    const t = useTranslations('ContactPage');

    return (
        <main className={styles.page}>
            <ConfettiBg />
            <TopNav />

            <section className={styles.hero}>
                <h1 className={styles.heroTitle}>
                    {t('hero.title')}
                </h1>
                <div className={styles.ctaGroup}>
                    <p className={styles.ctaHint}>{t('hero.subtitle')}</p>
                </div>
            </section>

            <section className={styles.contentContainer}>
                <div className={styles.mainGrid}>
                    {/* Primary Contact Card */}
                    <div className={styles.contactCard}>
                        <div className={styles.cardHeader}>
                            <span className="material-symbols-outlined">mail</span>
                            <h2 className={styles.cardTitle}>{t('profile.title')}</h2>
                        </div>
                        <p className={styles.philosophy}>
                            {t('profile.philosophy')}
                        </p>
                        <div className={styles.actionArea}>
                            <a href="mailto:kmc2438@kamiyama.ac.jp" className={styles.mailBtn}>
                                {t('profile.sendEmail')}
                            </a>
                            <div className={styles.copyWrapper}>
                                <CopyEmailButton />
                            </div>
                        </div>
                    </div>

                    {/* Technical / Terminal Block */}
                    <div className={styles.terminalWrapper}>
                        <div className={styles.terminalHeader}>
                            <div className={styles.dots}>
                                <span className={styles.dotRed}></span>
                                <span className={styles.dotYellow}></span>
                                <span className={styles.dotGreen}></span>
                            </div>
                            <p className={styles.terminalTitle}>{t('terminal.title')}</p>
                        </div>
                        <div className={styles.terminalBody}>
                            <div className={styles.terminalText}>
                                <p><span className={styles.prompt}>kota@portfolio:~$</span> {t('terminal.socialsPrompt')}</p>
                                <div className={styles.cliLinks}>
                                    <Link href="https://github.com/Buchi-dev-dzn" target="_blank" className={styles.cliLink}>github</Link>
                                    <Link href="https://x.com/buchii___" target="_blank" className={styles.cliLink}>twitter</Link>
                                    <Link href="https://www.linkedin.com/in/kota-mizobuchi/" target="_blank" className={styles.cliLink}>linkedin</Link>
                                </div>
                                <p><span className={styles.prompt}>kota@portfolio:~$</span> {t('terminal.methodsPrompt')}</p>
                                <p className={styles.cliEmail}>{t('terminal.email')}</p>
                                <p className={styles.cliEmail}>{t('terminal.sns')}</p>
                                <p><span className={styles.prompt}>kota@portfolio:~$</span> <span className={styles.cursor}>_</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
