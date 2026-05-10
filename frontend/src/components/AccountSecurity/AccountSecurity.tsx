"use client";
import React from "react";
import { UpdateUserForm } from "../Forms/UpdateUserForm";
import styles from "./AccountSecurity.module.scss";
import { type ValueOf } from "@/types/valueOf";
import Button from "../Button";
import { Hidden } from "../Hidden/Hidden";
import { GoBackSvg } from "@/assets/GoBackSvg";
import { LockSvg } from "@/assets/LockSvg";
import { Base } from "../Base/Base";
import { pxToRem } from "@/utils/pxToRem";
import { COLORS } from "@/theme/theme.constants";

interface AccountSecurityProps {
  HeaderSlot: React.ReactNode;
}

interface SlotProps {
  state: ValueOf<typeof STATE>;
  onClickChangePassword?: () => void;
}

const STATE = {
  MANAGE_LIST: "manage_list",
  CHANGE_PASSWORD: "change_password",
};

function ChangePasswordSlot() {
  return (
    <UpdateUserForm.Root submitButtonLabel="Update Password">
      <UpdateUserForm.NewPassword />
    </UpdateUserForm.Root>
  );
}

function Slot(props: SlotProps) {
  const { state, onClickChangePassword } = props;

  switch (state) {
    case STATE.CHANGE_PASSWORD:
      return <ChangePasswordSlot />;
    case STATE.MANAGE_LIST:
      return (
        <ul className={styles.manageList}>
          <li className={styles.manageList_item}>
            <section className={styles.manageList_section}>
              <div className={styles.manageList_itemHeader}>
                <LockSvg className={styles.manageList_icon} />
                <div className={styles.manageList_itemHeaderText}>
                  <Base
                    as="h3"
                    fontSize={pxToRem(12)}
                    color={COLORS.TEXT_SECONDARY}
                    textWrap="balance"
                  >
                    Manage your password
                  </Base>

                  <Base
                    as="p"
                    fontSize={pxToRem(11)}
                    color={COLORS.TEXT_TERTIARY}
                    textWrap="balance"
                  >
                    keep your password with password manager, to avoid forgetting it
                  </Base>
                </div>
              </div>

              <Button.AsButton variant="outlined" onClick={onClickChangePassword}>
                Change
              </Button.AsButton>
            </section>
          </li>
        </ul>
      );
    default:
      return null;
  }
}

export function AccountSecurity(props: AccountSecurityProps) {
  const { HeaderSlot } = props;

  const [state, setState] = React.useState<ValueOf<typeof STATE>>(STATE.MANAGE_LIST);

  return (
    <div className={styles.accountSecurity}>
      <div className={styles.accountSecurity_sectionHeader}>
        {HeaderSlot}

        {state !== STATE.MANAGE_LIST && (
          <Button.AsButton variant="outlined" onClick={() => setState(STATE.MANAGE_LIST)}>
            <GoBackSvg className={styles.accountSecurity_icon} />
            <Hidden>Return to account management</Hidden>
          </Button.AsButton>
        )}
      </div>

      <Slot state={state} onClickChangePassword={() => setState(STATE.CHANGE_PASSWORD)} />
    </div>
  );
}
