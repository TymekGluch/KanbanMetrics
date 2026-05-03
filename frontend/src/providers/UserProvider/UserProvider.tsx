"use client";

import { type GetApiUserMeSuccessResponse } from "@/generated/api-aliases";
import React from "react";

type User = GetApiUserMeSuccessResponse;

export const UserContext = React.createContext<User | null>(null);

interface UserProviderProps extends React.PropsWithChildren {
  user: User | null;
}

export function UserProvider(props: UserProviderProps) {
  const { user, children } = props;

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
