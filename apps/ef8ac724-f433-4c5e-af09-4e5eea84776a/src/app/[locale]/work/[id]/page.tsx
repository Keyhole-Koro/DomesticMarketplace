"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { featuredProjects } from "@/features/work/data";
import { ConfettiBg } from "@/components/ConfettiBg";
import { TopNav } from "@/components/landing/TopNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import styles from "./page.module.css";

export default function ProjectDetailPage() {
    const { id } = useParams();
    const locale = useLocale() as 'en' | 'ja';
    const t = useTranslations('Work');
    const project = featuredProjects.find((p) => p.id === id);

    // Added image switcher logic
    const allImages = project ? [project.image, ...(project.gallery || [])].filter(Boolean) : [];
    const [activeImage, setActiveImage] = useState(allImages[0] || "");

    if (!project) {
        return (
            <main className={styles.page}>
                <ConfettiBg />
                <TopNav />
                <section className={styles.notFound}>
                    <h1>Project Not Found</h1>
                </section>
                <SiteFooter />
            </main>
        );
    }

    const title = project.title[locale];
    const summary = project.summary[locale];
    const type = project.type[locale];
    const role = project.role?.[locale];
    const description = project.description?.[locale];

    return (
        <main className={styles.page}>
            <ConfettiBg />
            <TopNav />

            <section className={styles.organicSection}>

                <header className={styles.hero}>
                    <h1 className={styles.title}>{title}</h1>

                    <div className={styles.meta}>
                        <span>{summary}</span>
                    </div>
                </header>

                <div className={styles.galleryContainer}>
                    <div className={styles.mainDisplay}>
                        {activeImage && (
                            <img src={activeImage} alt={`${title} - Active`} className={styles.mainImage} />
                        )}
                    </div>
                    <div className={styles.thumbnailGrid}>
                        {allImages.slice(0, 4).map((img, index) => (
                            <button
                                key={index}
                                className={`${styles.thumbnailBtn} ${activeImage === img ? styles.activeThumbnail : ""}`}
                                onClick={() => setActiveImage(img as string)}
                            >
                                <img src={img as string} alt={`${title} - Thumbnail ${index + 1}`} className={styles.thumbImage} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.infoBar}>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>ROLE</span>
                        <span className={styles.infoValue}>{role || "Developer"}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>TIMELINE</span>
                        <span className={styles.infoValue}>{project.duration || project.year}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>CATEGORY</span>
                        <span className={styles.infoValue}>{type.split(" / ")[0]}</span>
                    </div>
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.descriptionSection}>
                        <h2>{t('detail.overview')}</h2>
                        <p className={styles.description}>
                            {description || summary}
                        </p>
                        {(project.achievements) && (
                            <>
                                <h2>{t('detail.achievements')}</h2>
                                <p className={styles.achievements}>
                                    {project.achievements.map((achievement) => achievement[locale]).join("\n")}
                                </p>
                            </>
                        )}
                    </div>

                    <aside className={styles.sidebarSection}>
                        <div>
                            <h2>{t('detail.techStack')}</h2>
                            <ul className={styles.techList}>
                                {project.stack.map((tech) => (
                                    <li key={tech} className={styles.techItem}>
                                        {tech}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {(project.links?.github || project.links?.live) && (
                            <div className={styles.links}>
                                <h2>{t('detail.links')}</h2>
                                {project.links.live && (
                                    <a
                                        href={project.links.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.linkBtn}
                                    >
                                        {t('detail.live')}
                                    </a>
                                )}
                                {project.links.github && (
                                    <a
                                        href={project.links.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${styles.linkBtn} ${styles.linkBtnSecondary}`}
                                    >
                                        {t('detail.source')}
                                    </a>
                                )}
                            </div>
                        )}
                    </aside>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
