import { AccountActivationSection } from "./AccountActivation.server";
import { AccountActivationSessionDialog } from "./AccountActivation.client";

interface AccountActivationProps {
  Section: typeof AccountActivationSection;
  SessionDialog: typeof AccountActivationSessionDialog;
}

const AccountActivation: AccountActivationProps = {
  Section: AccountActivationSection,
  SessionDialog: AccountActivationSessionDialog,
};

export default AccountActivation;
