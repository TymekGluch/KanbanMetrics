export function resolveRole(name?: string) {
  switch (name) {
    case "app_user":
      return "User";
    case "app_admin":
      return "Admin";
    default:
      return name;
  }
}

export function resolveDate(dateString?: string) {
  return new Date(dateString || "").toUTCString().replace(" GMT", "");
}
