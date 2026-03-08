"use client";
import { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { featuredProjects, WorkProjectGrid } from "@/features/work";
import { ConfettiBg } from "@/components/ConfettiBg";
import { TopNav } from "@/components/landing/TopNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import styles from "./page.module.css";

export default function WorkPage() {
    const locale = useLocale() as 'en' | 'ja';
    const t = useTranslations('Work');
    const [filter, setFilter] = useState("All");
    const [sortBy, setSortBy] = useState("Newest");

    const categories = useMemo(() => {
        const types = featuredProjects.map(p => p.type[locale].split(" / ")[0]);
        return ["All", ...new Set(types)];
    }, [locale]);

    const filteredProjects = useMemo(() => {
        let result = [...featuredProjects];

        if (filter !== "All") {
            result = result.filter(p => p.type[locale].includes(filter));
        }

        if (sortBy === "Newest") {
            result.sort((a, b) => b.year.localeCompare(a.year));
        } else if (sortBy === "Oldest") {
            result.sort((a, b) => a.year.localeCompare(b.year));
        } else if (sortBy === "Alphabetical") {
            result.sort((a, b) => a.title[locale].localeCompare(b.title[locale]));
        }

        return result;
    }, [filter, sortBy, locale]);

    return (
        <main className={styles.page}>
            <ConfettiBg />
            <TopNav />

            <section className={styles.hero}>
                <h1 className={styles.heroTitle}>
                    {t('title')}
                </h1>
                <div className={styles.ctaGroup}>
                    <p className={styles.ctaHint}>{t('subtitle')}</p>
                </div>
            </section>

            <section className={styles.organicSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{t('selected')}</h2>
                    <div className={styles.sectionDivider}></div>
                </div>

                <div className={styles.controls}>
                    <div className={styles.filterGroup}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`${styles.filterBtn} ${filter === cat ? styles.activeFilter : ""}`}
                                onClick={() => setFilter(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className={styles.sortGroup}>
                        <span className={styles.sortLabel}>{t('sort.label')}</span>
                        <div className={styles.sortControls}>
                            {[
                                { id: "Newest", label: t('sort.newest') },
                                { id: "Oldest", label: t('sort.oldest') },
                                { id: "Alphabetical", label: t('sort.alphabetical') }
                            ].map(option => (
                                <button
                                    key={option.id}
                                    className={`${styles.sortBtn} ${sortBy === option.id ? styles.activeSort : ""}`}
                                    onClick={() => setSortBy(option.id)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.gridWrapper}>
                    <WorkProjectGrid projects={filteredProjects} ctaLabel={t('cta')} />
                    {filteredProjects.length === 0 && (
                        <p className={styles.noResults}>{t('noResults')}</p>
                    )}
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
