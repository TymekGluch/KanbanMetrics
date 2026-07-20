export const nextFetchTags = {
  me: "me",
  workspaces: "workspaces",
  accountActivationCode: "account-activation-code",
  workspace: (workspaceId: string) => `workspace-${workspaceId}`,
};
