import { type GetApiUserMeSuccessResponse } from "@/generated/api-aliases";
import styles from "./AuthFormSuccessStatus.module.scss";
import { CheckSvg } from "@/assets/CheckSvg";
import Button, { BUTTON_VARIANTS } from "@/components/Button";
import { HomeSvg } from "@/assets/HomeSvg";

interface AuthFormSuccessStatusProps {
  user: GetApiUserMeSuccessResponse;
  isFromLogin?: boolean;
}

export function AuthFormSuccessStatus(props: AuthFormSuccessStatusProps) {
  const { user, isFromLogin } = props;

  return (
    <section className={styles.authFormSuccessStatus}>
      <div className={styles.authFormSuccessStatus_textContent}>
        <div className={styles.authFormSuccessStatus_iconWrapper}>
          <CheckSvg className={styles.authFormSuccessStatus_icon} />
        </div>

        <h2 className={styles.authFormSuccessStatus_titleMessage}>
          {isFromLogin ? (
            <>
              Welcome back, <em className={styles.authFormSuccessStatus_userName}>{user.name}!</em>{" "}
              You are successfully authenticated.
            </>
          ) : (
            <>
              Hi <em className={styles.authFormSuccessStatus_userName}>{user.name}</em>, your
              account has been created successfully!
            </>
          )}
        </h2>
      </div>

      <ul className={styles.authFormSuccessStatus_options}>
        <li className={styles.authFormSuccessStatus_option}>
          <Button.AsLink href="/dashboard" width="100%">
            Go to Dashboard
          </Button.AsLink>
        </li>

        <span className={styles.authFormSuccessStatus_optionDivider} />

        <li className={styles.authFormSuccessStatus_option}>
          <Button.AsLink
            href="/"
            width="100%"
            variant={BUTTON_VARIANTS.OUTLINED}
            StartIconSlot={<HomeSvg className={styles.authFormSuccessStatus_optionIcon} />}
          >
            Go to Home page
          </Button.AsLink>
        </li>
      </ul>
    </section>
  );
}
