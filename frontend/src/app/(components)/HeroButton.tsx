"use client";

import Button from "@/components/Button";
import { UserContext } from "@/providers/UserProvider/UserProvider";
import React from "react";

export function HeroButton() {
  const user = React.useContext(UserContext);

  const href = Boolean(user) ? "/dashboard" : "/auth/register";

  return (
    <Button.AsLink
      href={href}
      width={{
        default: "100%",
        lg: "fit-content",
      }}
      size="large"
    >
      Get started for free
    </Button.AsLink>
  );
}
