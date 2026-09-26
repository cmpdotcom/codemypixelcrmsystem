export type PermissionAction = "view" | "create" | "edit" | "del" | "assign";

export interface PermissionSet {
  view: boolean;
  create: boolean;
  edit: boolean;
  del: boolean;
  assign: boolean;
}

export type PermissionsMap = Record<string, PermissionSet>;

export const CRM_MODULES = [
  "Dashboard",
  "Workflow",
  "Leads",
  "Activities",
  "Deals",
  "Clients",
  "Follow-ups",
  "Projects",
  "Tasks",
  "Milestones",
  "QA",
  "Deployments",
  "Setters",
  "Closers",
  "Developers",
  "Performance",
  "Payments",
  "Commissions",
  "Reports",
  "Users",
  "Settings",
  "Integrations",
] as const;

export const PERMISSION_ACTIONS: PermissionAction[] = ["view", "create", "edit", "del", "assign"];

export const EMPTY_PERMISSIONS: PermissionSet = {
  view: false,
  create: false,
  edit: false,
  del: false,
  assign: false,
};

export const FULL_PERMISSIONS: PermissionSet = {
  view: true,
  create: true,
  edit: true,
  del: true,
  assign: true,
};

export const READ_PERMISSIONS: PermissionSet = {
  view: true,
  create: false,
  edit: false,
  del: false,
  assign: false,
};

export const STANDARD_PERMISSIONS: PermissionSet = {
  view: true,
  create: true,
  edit: true,
  del: false,
  assign: true,
};

const clone = (permissions: PermissionSet) => ({ ...permissions });

export function emptyPermissions(): PermissionsMap {
  return Object.fromEntries(CRM_MODULES.map((module) => [module, clone(EMPTY_PERMISSIONS)]));
}

export function defaultPermissionsForRole(roleName: string): PermissionsMap {
  const permissions = emptyPermissions();
  const grant = (modules: string[], value: PermissionSet) => modules.forEach((module) => { permissions[module] = clone(value); });
  const fullRoles = new Set(["Super Admin", "Executive", "Sales Manager"]);

  if (fullRoles.has(roleName)) return Object.fromEntries(CRM_MODULES.map((module) => [module, clone(FULL_PERMISSIONS)]));

  grant(["Dashboard"], READ_PERMISSIONS);
  if (roleName === "Setter") {
    grant(["Leads", "Activities", "Follow-ups"], STANDARD_PERMISSIONS);
    grant(["Reports"], READ_PERMISSIONS);
  } else if (roleName === "Closer") {
    grant(["Leads", "Activities", "Deals", "Clients", "Follow-ups"], STANDARD_PERMISSIONS);
    grant(["Reports"], READ_PERMISSIONS);
  } else if (roleName === "Developer") {
    grant(["Projects", "Tasks", "Milestones", "Deployments"], STANDARD_PERMISSIONS);
    grant(["QA", "Activities"], READ_PERMISSIONS);
  } else if (roleName === "QA" || roleName === "Tester") {
    grant(["QA"], STANDARD_PERMISSIONS);
    grant(["Projects", "Tasks", "Milestones", "Deployments", "Activities"], READ_PERMISSIONS);
  } else if (roleName === "DevOps") {
    grant(["Deployments"], STANDARD_PERMISSIONS);
    grant(["Projects", "Tasks", "Milestones", "QA", "Activities"], READ_PERMISSIONS);
  } else if (roleName === "Marketing") {
    grant(["Leads"], { view: true, create: true, edit: true, del: false, assign: false });
    grant(["Reports", "Clients"], READ_PERMISSIONS);
  }

  return permissions;
}

export function normalizePermissions(raw: unknown, roleName?: string): PermissionsMap {
  const source = raw && typeof raw === "object" ? raw as Record<string, Partial<PermissionSet>> : {};
  const defaults = roleName ? defaultPermissionsForRole(roleName) : emptyPermissions();
  return Object.fromEntries(CRM_MODULES.map((module) => [
    module,
    {
      ...defaults[module],
      ...(source[module] || {}),
    },
  ]));
}

export function hasPermission(permissions: unknown, module: string, action: PermissionAction): boolean {
  const modulePermissions = permissions && typeof permissions === "object"
    ? (permissions as Record<string, Partial<PermissionSet>>)[module]
    : undefined;
  return modulePermissions?.[action] === true;
}

export function canPerform(permissions: unknown, module: string, action: PermissionAction): boolean {
  return hasPermission(permissions, module, action) && (action === "view" || hasPermission(permissions, module, "view"));
}

export function pageModule(pathname: string): string | null {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/workflow")) return "Workflow";
  if (pathname.startsWith("/leads")) return "Leads";
  if (pathname.startsWith("/activities")) return "Activities";
  if (pathname.startsWith("/deals")) return "Deals";
  if (pathname.startsWith("/clients")) return "Clients";
  if (pathname.startsWith("/follow-up")) return "Follow-ups";
  if (pathname.startsWith("/projects/tasks")) return "Tasks";
  if (pathname.startsWith("/projects/milestones")) return "Milestones";
  if (pathname.startsWith("/projects")) return "Projects";
  if (pathname.startsWith("/qa")) return "QA";
  if (pathname.startsWith("/deployments")) return "Deployments";
  if (pathname.startsWith("/team/setters")) return "Setters";
  if (pathname.startsWith("/team/closers")) return "Closers";
  if (pathname.startsWith("/team/developers")) return "Developers";
  if (pathname.startsWith("/team/performance")) return "Performance";
  if (pathname.startsWith("/payments")) return "Payments";
  if (pathname.startsWith("/commissions")) return "Commissions";
  if (pathname.startsWith("/reports")) return "Reports";
  if (pathname.startsWith("/settings/users") || pathname.startsWith("/settings/teams")) return "Users";
  if (pathname.startsWith("/users")) return "Users";
  if (pathname.startsWith("/integrations")) return "Integrations";
  if (pathname.startsWith("/settings")) return "Settings";
  return null;
}

export function apiModule(pathname: string): string | null {
  if (pathname.startsWith("/api/workflow")) return "Workflow";
  if (pathname.startsWith("/api/leads")) return "Leads";
  if (pathname.startsWith("/api/activities")) return "Activities";
  if (pathname.startsWith("/api/deals")) return "Deals";
  if (pathname.startsWith("/api/clients")) return "Clients";
  if (pathname.startsWith("/api/follow-ups")) return "Follow-ups";
  if (pathname.startsWith("/api/projects")) return "Projects";
  if (pathname.startsWith("/api/tasks")) return "Tasks";
  if (pathname.startsWith("/api/milestones")) return "Milestones";
  if (pathname.startsWith("/api/qa")) return "QA";
  if (pathname.startsWith("/api/deployments")) return "Deployments";
  if (pathname.startsWith("/api/team/setters")) return "Setters";
  if (pathname.startsWith("/api/team/closers")) return "Closers";
  if (pathname.startsWith("/api/team/developers")) return "Developers";
  if (pathname.startsWith("/api/team/performance")) return "Performance";
  if (pathname.startsWith("/api/payments")) return "Payments";
  if (pathname.startsWith("/api/commissions")) return "Commissions";
  if (pathname.startsWith("/api/reports")) return "Reports";
  if (pathname.startsWith("/api/users") || pathname.startsWith("/api/teams") || pathname.startsWith("/api/invitations")) return "Users";
  if (pathname.startsWith("/api/roles") || pathname.startsWith("/api/settings")) return "Settings";
  if (pathname.startsWith("/api/integrations")) return "Integrations";
  return null;
}

export function actionForMethod(method: string): PermissionAction {
  if (method === "POST") return "create";
  if (method === "PATCH" || method === "PUT") return "edit";
  if (method === "DELETE") return "del";
  return "view";
}
