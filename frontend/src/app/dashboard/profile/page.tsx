import { Base } from "@/components/Base/Base";
import { UpdateUserForm } from "@/components/Forms/UpdateUserForm";
import PageLayoutPanel from "@/components/PageLayout/PageLayoutPanel";
import { COLORS } from "@/theme/theme.constants";
import { pxToRem } from "@/utils/pxToRem";
import styles from "./page.module.scss";
import { Separator } from "@/components/Separator/Separator";
import { DeleteAccountButton } from "@/components/DeleteAccountButton";
import { AccountDetails } from "@/components/AccountDetails/AccountDetails";

export const metadata = {
  title: "Profile",
  description:
    "Welcome to your profile! Here you can view and edit your personal information, manage your account settings, and customize your preferences for a personalized experience.",
};

export default function ProfilePage() {
  return (
    <PageLayoutPanel.Provider>
      <PageLayoutPanel.Root>
        <PageLayoutPanel.TopNavigationMobile />
        <PageLayoutPanel.NavigationContent />
        <PageLayoutPanel.Header>
          <Base as="h1" fontSize={pxToRem(24)}>
            Your Profile
          </Base>
          <Base
            as="p"
            fontSize={pxToRem(12)}
            color={COLORS.TEXT_SECONDARY}
            textAlign={{
              default: "center",
              lg: "left",
            }}
            textWrap="balance"
          >
            Welcome to your profile! Here you can view and edit your personal information.
          </Base>
        </PageLayoutPanel.Header>
        <PageLayoutPanel.Details>
          <div className={styles.profilePageContent}>
            <section className={styles.profilePageContent_profileInformation}>
              <Base as="h2" fontSize={pxToRem(16)}>
                Profile Information
              </Base>

              <UpdateUserForm />
            </section>

            <div className={styles.profilePageContent_column}>
              <section className={styles.profilePageContent_accountDetails}>
                <Base as="h2" fontSize={pxToRem(16)}>
                  Account Details
                </Base>

                <AccountDetails />
              </section>

              <section className={styles.profilePageContent_dangerZone}>
                <div className={styles.profilePageContent_dangerZoneContent}>
                  <Base as="h2" fontSize={pxToRem(16)}>
                    Danger Zone
                  </Base>

                  <Base as="p" fontSize={pxToRem(12)} color={COLORS.TEXT_SECONDARY}>
                    Be careful with these actions. They can have significant consequences.
                  </Base>
                </div>

                <Separator background={COLORS.STATUS_DANGER_BORDER} />

                <div className={styles.profilePageContent_dangerZoneContent}>
                  <Base as="h3" fontSize={pxToRem(14)}>
                    Delete Account
                  </Base>

                  <Base as="p" fontSize={pxToRem(12)} color={COLORS.TEXT_SECONDARY}>
                    Delete your account and all associated data. This action is irreversible.
                  </Base>
                </div>

                <DeleteAccountButton>Delete account</DeleteAccountButton>
              </section>
            </div>
          </div>
        </PageLayoutPanel.Details>
      </PageLayoutPanel.Root>
    </PageLayoutPanel.Provider>
  );
}
