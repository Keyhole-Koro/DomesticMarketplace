"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import styles from "./TopNav.module.css";

export function TopNav() {
  const pathname = usePathname();
  const t = useTranslations('Common.nav');
  const locale = useLocale();

  const renderBreadcrumbs = () => {
    const segments = pathname === "/" ? [] : pathname.replace(/^\//, "").split("/");
    const breadcrumbs = [
      { label: "HOME", href: "/" },
      ...segments.map((segment, index) => ({
        label: segment.toUpperCase().replace(/-/g, " "),
        href: "/" + segments.slice(0, index + 1).join("/") as any,
      })),
    ];

    return (
      <>
        <div className={styles.desktopBreadcrumbs}>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <span key={crumb.href} className={styles.breadcrumbItem}>
                <Link
                  href={crumb.href}
                  className={`${isLast ? styles.activeCrumb : styles.inactiveCrumb} ${styles.truncateLabel}`}
                  title={crumb.label}
                >
                  {crumb.label}
                </Link>
                {(!isLast || pathname === "/") && (
                  <span className={styles.separator}>/</span>
                )}
              </span>
            );
          })}
        </div>

        <div className={styles.mobileBreadcrumbs}>
          {pathname === "/" ? (
            <span className={styles.activeCrumb}>HOME</span>
          ) : (
            <div className={styles.breadcrumbItem}>
              <Link
                href={"/" + segments.slice(0, -1).join("/") as any}
                className={styles.inactiveCrumb}
                title="Go up one level"
              >
                ...
              </Link>
              <span className={styles.separator}>/</span>
              <span className={`${styles.activeCrumb} ${styles.truncateLabel}`} title={segments[segments.length - 1].toUpperCase().replace(/-/g, " ")}>
                {segments[segments.length - 1].toUpperCase().replace(/-/g, " ")}
              </span>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <header className={styles.topNav}>
      <div className={styles.brand}>{renderBreadcrumbs()}</div>
      <nav className={styles.navLinks} aria-label="Primary navigation">
        <Link href="/work">{t('work')}</Link>
        <Link href="/about">{t('about')}</Link>
        <Link href="/contact">{t('contact')}</Link>

        <div className={styles.langSwitcher}>
          <Link href={pathname} locale="en" className={locale === 'en' ? styles.activeLang : ""}>
            EN
          </Link>
          <span className={styles.langSeparator}>|</span>
          <Link href={pathname} locale="ja" className={locale === 'ja' ? styles.activeLang : ""}>
            JA
          </Link>
        </div>
      </nav>
    </header>
  );
}
