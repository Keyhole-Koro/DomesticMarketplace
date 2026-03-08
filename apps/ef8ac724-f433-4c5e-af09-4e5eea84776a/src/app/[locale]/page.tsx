import { ConfettiBg } from "@/components/ConfettiBg";
import { AboutSection } from "@/components/landing/AboutSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { HeroSection } from "@/components/landing/HeroSection";
import { TopNav } from "@/components/landing/TopNav";
import { WorkSection } from "@/components/landing/WorkSection";
import styles from "./page.module.css";

export default function Page() {
  return (
    <main className={styles.page}>
      <ConfettiBg />
      <TopNav />
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <ContactSection />
      <SiteFooter />
    </main>
  );
}
