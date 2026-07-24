"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Button from "../Button";
import Dialog from "../Dialog";
import { Base } from "../Base/Base";
import { pxToRem } from "@/utils/pxToRem";

interface AccountActivationSessionDialogProps {
  isUserVerified: boolean;
}

export function AccountActivationSessionDialog(props: AccountActivationSessionDialogProps) {
  const { isUserVerified } = props;

  const pathname = usePathname();

  const isProfilePage = pathname === "/dashboard/profile";

  if (isUserVerified || isProfilePage) {
    return null;
  }

  return (
    <Dialog.Root open>
      <Dialog.Content>
        <Dialog.Body>
          <Dialog.Header>
            <Base as="div" display="flex" flexDirection="column" gap={8}>
              <Dialog.Title>Your account is not verified yet</Dialog.Title>

              <Dialog.Description>
                Please check your email for the activation code to verify your account. If you
                haven&apos;t received the code, you can generate a new one.
              </Dialog.Description>
            </Base>
          </Dialog.Header>

          <Dialog.Footer>
            <Button.AsLink prefetch href="/dashboard/profile" width="100%" marginTop={pxToRem(24)}>
              Go to Profile Page
            </Button.AsLink>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
}
