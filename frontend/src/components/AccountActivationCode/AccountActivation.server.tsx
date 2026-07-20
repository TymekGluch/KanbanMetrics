import { WarningSvg } from "@/assets/WarningSvg";
import {
  type GetApiAccountActivationCodeGetSuccessResponse,
  type GetApiUserMeSuccessResponse,
} from "@/generated/api-aliases";
import { COLORS } from "@/theme/theme.constants";
import { pxToRem } from "@/utils/pxToRem";
import { clsx } from "clsx";
import { Base } from "../Base/Base";
import { AccountActivationForm } from "../Forms/AccountActivationForm/AccountActivationForm";
import { Separator } from "../Separator/Separator";
import { ACCOUNT_ACTIVATION_PRIORITIES } from "./AccountActivation.constants";
import styles from "./AccountActivation.module.scss";
import {
  getRemainingDaysByCreationDate,
  inferAccountActivationPriority,
} from "./AccountActivation.utils";

type AccountActivationSectionProps = {
  activationCode: GetApiAccountActivationCodeGetSuccessResponse | null;
  user: GetApiUserMeSuccessResponse;
};

export async function AccountActivationSection(props: AccountActivationSectionProps) {
  const { user, activationCode } = props;

  const priority = inferAccountActivationPriority(
    user?.created_at ? new Date(user.created_at) : new Date()
  );

  const TEXT_COLOR_BY_PRIORITY = {
    [ACCOUNT_ACTIVATION_PRIORITIES.HIGH]: COLORS.STATUS_DANGER_TEXT,
    [ACCOUNT_ACTIVATION_PRIORITIES.MEDIUM]: COLORS.STATUS_WARNING_TEXT,
    [ACCOUNT_ACTIVATION_PRIORITIES.LOW]: COLORS.TEXT_PRIMARY,
  };

  const SEPARATOR_COLOR_BY_PRIORITY = {
    [ACCOUNT_ACTIVATION_PRIORITIES.HIGH]: COLORS.STATUS_DANGER_BORDER,
    [ACCOUNT_ACTIVATION_PRIORITIES.MEDIUM]: COLORS.STATUS_WARNING_BORDER,
    [ACCOUNT_ACTIVATION_PRIORITIES.LOW]: COLORS.DIVIDER_SUBTLE,
  };

  if (user?.is_verified) {
    return null;
  }

  return (
    <section
      className={clsx(styles.accountActivationSection, {
        [styles.accountActivationSection__highPriority]:
          priority === ACCOUNT_ACTIVATION_PRIORITIES.HIGH,
        [styles.accountActivationSection__mediumPriority]:
          priority === ACCOUNT_ACTIVATION_PRIORITIES.MEDIUM,
      })}
    >
      <header className={styles.accountActivationSection_header}>
        <Base as="h2" fontSize={pxToRem(16)} color={TEXT_COLOR_BY_PRIORITY[priority]}>
          Activate Your Account
        </Base>

        <WarningSvg className={styles.accountActivationSection_warningIcon} />
      </header>

      <Base
        as="p"
        fontSize={pxToRem(12)}
        color={COLORS.TEXT_SECONDARY}
        textWrap="balance"
        maxInlineSize="60ch"
      >
        Your account is not yet activated. Please check your email for the activation code to verify
        your account.
      </Base>

      <Separator background={SEPARATOR_COLOR_BY_PRIORITY[priority]} marginY={pxToRem(8)} />

      <Base
        as="p"
        fontSize={pxToRem(12)}
        color={COLORS.TEXT_SECONDARY}
        textWrap="balance"
        maxInlineSize="60ch"
      >
        Remaining days to activate your account:{" "}
        <strong>
          {user?.created_at
            ? getRemainingDaysByCreationDate(new Date(user.created_at))
            : "Unknown"}{" "}
        </strong>
      </Base>

      <Base
        as="p"
        fontSize={pxToRem(11)}
        opacity={0.9}
        color={
          priority === ACCOUNT_ACTIVATION_PRIORITIES.MEDIUM
            ? COLORS.STATUS_WARNING_TEXT
            : COLORS.STATUS_DANGER_TEXT
        }
        textWrap="balance"
      >
        after this period, your account will be deleted
      </Base>

      <Separator background={SEPARATOR_COLOR_BY_PRIORITY[priority]} marginY={pxToRem(8)} />

      <AccountActivationForm
        expirationAt={activationCode?.expires_at ? new Date(activationCode.expires_at) : undefined}
      />
    </section>
  );
}
