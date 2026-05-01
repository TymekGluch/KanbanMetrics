import PageLayoutDefault from "@/components/PageLayout/PageLayoutDefault";

export const metadata = {
  title: "Login",
};

export default function Login() {
  return (
    <PageLayoutDefault.Root>
      <PageLayoutDefault.Navigation withBreadcrumbs />
    </PageLayoutDefault.Root>
  );
}
