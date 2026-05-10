"use client";

import { type GetApiUserMeSuccessResponse } from "@/generated/api-aliases";
import React from "react";

type User = GetApiUserMeSuccessResponse;

export const UserContext = React.createContext<User | null>(null);
export const SetUserContext = React.createContext<React.Dispatch<
  React.SetStateAction<User | null>
> | null>(null);

interface UserProviderProps extends React.PropsWithChildren {
  user: User | null;
}

export function UserProvider(props: UserProviderProps) {
  const { user, children } = props;

  const [localUser, setLocalUser] = React.useState<User | null>(user);

  React.useEffect(() => {
    setLocalUser(user);
  }, [user]);

  return (
    <SetUserContext.Provider value={setLocalUser}>
      <UserContext.Provider value={localUser}>{children}</UserContext.Provider>
    </SetUserContext.Provider>
  );
}
