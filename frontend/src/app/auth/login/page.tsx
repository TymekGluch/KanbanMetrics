import { AuthForm } from "@/components/Forms/AuthForm/AuthForm";
import { AUTH_FORM_VARIANTS } from "@/components/Forms/AuthForm/AuthForm.constants";
import { Media } from "@/components/Media";
import { MEDIA_CONDITION } from "@/components/Media/Media.constants";
import PageLayoutDefault from "@/components/PageLayout/PageLayoutDefault";
import { BREAKPOINTS_KEYS } from "@/responsive/responsive.constants";
import styles from "./page.module.scss";

export const metadata = {
  title: "Login",
  description:
    "Access your account to view your personalized dashboard, track your workflow performance, and gain insights with Morphyxis Kanban Metrics.",
};

export default function Login() {
  return (
    <PageLayoutDefault.Root>
      <PageLayoutDefault.Navigation withBreadcrumbs />

      <PageLayoutDefault.Content align="center">
        <div className={styles.authContent}>
          <header className={styles.authContent_header}>
            <h1 className={styles.authContent_title}>Log in to your account</h1>

            <p className={styles.authContent_description}>
              Access your dashboard and continue your work.
            </p>

            <Media.Client
              variant={MEDIA_CONDITION.BREAKPOINTS}
              condition={{
                [BREAKPOINTS_KEYS.lg]: true,
              }}
            >
              <div className={styles.authContent_imageWrapper}>
                <picture>
                  <source srcSet="/loginDark.webp" media="(prefers-color-scheme: dark)" />
                  <img
                    src="/login.webp"
                    alt=""
                    width={535}
                    height={467}
                    className={styles.authContent_image}
                    loading="lazy"
                  />
                </picture>
              </div>
            </Media.Client>
          </header>

          <div className={styles.authContent_form}>
            <AuthForm variant={AUTH_FORM_VARIANTS.LOGIN} />
          </div>
        </div>
        <Media.Client
          variant={MEDIA_CONDITION.BREAKPOINTS}
          condition={{
            [BREAKPOINTS_KEYS.lg]: true,
          }}
          Fallback={
            <div className={styles.authContent_imageWrapper}>
              <picture>
                <source srcSet="/loginDark.webp" media="(prefers-color-scheme: dark)" />
                <img
                  src="/login.webp"
                  alt=""
                  width={535}
                  height={467}
                  className={styles.authContent_image}
                  loading="lazy"
                />
              </picture>
            </div>
          }
        />
      </PageLayoutDefault.Content>

      <PageLayoutDefault.Footer />
    </PageLayoutDefault.Root>
  );
}
