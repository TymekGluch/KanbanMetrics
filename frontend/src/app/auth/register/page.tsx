import PageLayoutDefault from "@/components/PageLayout/PageLayoutDefault";
import Image from "next/image";
import styles from "./page.module.scss";
import { Media } from "@/components/Media";
import { MEDIA_CONDITION } from "@/components/Media/Media.constants";
import { BREAKPOINTS_KEYS } from "@/responsive/responsive.constants";

export const metadata = {
  title: "Register",
};

export default function Register() {
  return (
    <PageLayoutDefault.Root>
      <PageLayoutDefault.Navigation withBreadcrumbs />

      <PageLayoutDefault.Content align="center">
        <div className={styles.authContent}>
          <header className={styles.authContent_header}>
            <h1 className={styles.authContent_title}>Create your account</h1>

            <p className={styles.authContent_description}>
              Get started with{" "}
              <em className={styles.authContent_emphasis}>Morphyxis Kanban Metrics</em> and track
              your workflow performance.
            </p>

            <Media.Client
              variant={MEDIA_CONDITION.BREAKPOINTS}
              condition={{
                [BREAKPOINTS_KEYS.lg]: true,
              }}
            >
              <Image
                src="/login.webp"
                alt=""
                width={535}
                height={467}
                className={styles.authContent_image}
              />
            </Media.Client>
          </header>

          <div className={styles.authContent_form}>fsdf</div>
        </div>
        <Media.Client
          variant={MEDIA_CONDITION.BREAKPOINTS}
          condition={{
            [BREAKPOINTS_KEYS.lg]: true,
          }}
          Fallback={
            <Image
              src="/login.webp"
              alt=""
              width={535}
              height={467}
              className={styles.authContent_image}
            />
          }
        />
      </PageLayoutDefault.Content>

      <PageLayoutDefault.Footer />
    </PageLayoutDefault.Root>
  );
}
