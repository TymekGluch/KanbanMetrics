import { getWorkspaceByIdFetch } from "@/api/getWorkspaceByIdFetch";
import { headers } from "next/headers";
import type { Metadata } from "next";
import PageLayoutPanel from "@/components/PageLayout/PageLayoutPanel";
import { Base } from "@/components/Base/Base";
import { pxToRem } from "@/utils/pxToRem";
import { COLORS } from "@/theme/theme.constants";
import { PanelNavigation } from "@/components/PanelNavigation/PanelNavigation";
import { DeleteWorkspaceButton } from "@/components/DeleteWorkspaceButton/DeleteWorkspaceButton";

interface WorkspacePageProps {
  params: Promise<{
    id: string;
  }>;
}

const defaultDescription =
  "View workspace details, members, and key Kanban metrics for this workspace.";

function resolveWorkspaceDescription(description?: string): string {
  const trimmedDescription = description?.trim();

  if (!trimmedDescription) {
    return defaultDescription;
  }

  return trimmedDescription;
}

export async function generateMetadata(props: WorkspacePageProps): Promise<Metadata> {
  const { params } = props;
  const { id } = await params;
  const headersList = await headers();
  const workspace = await getWorkspaceByIdFetch(headersList, id);

  const workspaceName = workspace?.name?.trim() || "Workspace";
  const description = resolveWorkspaceDescription(workspace?.description);

  return {
    title: workspaceName,
    description,
  };
}

export default async function WorkspacePage(props: WorkspacePageProps) {
  const { params } = props;

  const { id } = await params;
  const headersList = await headers();
  const workspace = await getWorkspaceByIdFetch(headersList, id);

  const workspaceName = workspace?.name?.trim() || "Workspace";
  const description = resolveWorkspaceDescription(workspace?.description);

  return (
    <PageLayoutPanel.Provider>
      <PageLayoutPanel.Root>
        <PageLayoutPanel.TopNavigationMobile />
        <PageLayoutPanel.NavigationContent>
          <PanelNavigation asListItems />
        </PageLayoutPanel.NavigationContent>
        <PageLayoutPanel.Header>
          <Base as="h1" fontSize={pxToRem(24)}>
            {workspaceName}
          </Base>

          <Base as="p" fontSize={pxToRem(12)} color={COLORS.TEXT_SECONDARY} textWrap="balance">
            {description}
          </Base>
        </PageLayoutPanel.Header>

        <PageLayoutPanel.Details>
          <DeleteWorkspaceButton
            confirmationTitle={`Are you sure you want to delete the workspace "${workspaceName}"?`}
            confirmationDescription="This action cannot be undone, and all data associated with this workspace will be permanently deleted."
          >
            Delete Workspace
          </DeleteWorkspaceButton>
        </PageLayoutPanel.Details>
      </PageLayoutPanel.Root>
    </PageLayoutPanel.Provider>
  );
}
