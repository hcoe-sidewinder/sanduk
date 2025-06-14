import type { IHereditaryDisease } from "../../../models/hereditary-disease";
import type { ILabReport } from "../../../models/lab-report";
import type { ISurgery } from "../../../models/surgery";
import type { Role } from "../../../models/types/user";
import type { IUser } from "../../../models/user";
import type { IVaccine } from "../../../models/vaccine";
import type { UserContext } from "../../../types/user-context";

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((userContext: UserContext, data: Permissions[Key]["dataType"]) => boolean);

type Policy = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

type Permissions = {
  users: {
    dataType: IUser;
    action: "view" | "create" | "update" | "delete";
  };
  surgeries: {
    dataType: ISurgery;
    action: "view" | "create" | "update" | "delete";
  };
  vaccines: {
    dataType: IVaccine;
    action: "view" | "create" | "update" | "delete";
  };
  labReports: {
    dataType: ILabReport;
    action: "view" | "create" | "update" | "delete";
  };
  hereditaries: {
    dataType: IHereditaryDisease;
    action: "view" | "create" | "update" | "delete";
  };
};

const policy: Policy = {
  FAMILY_ADMIN: {
    users: {
      view: (userContext, data) => {
        return userContext.sub == data._id || userContext.sub == data.familyAdmin;
      },
      create: true,
      update: (userContext, data) => {
        return userContext.sub == data._id || userContext.sub == data.familyAdmin;
      },
      delete: false,
    },
    surgeries: {
      view: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      create: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      update: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      delete: false,
    },
    vaccines: {
      view: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      create: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      update: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      delete: false,
    },
    labReports: {
      view: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      create: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      update: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      delete: false,
    },
    hereditaries: {
      view: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      create: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      update: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      delete: false,
    },
  },
  MEMBER: {
    users: {
      view: (userContext, data) => {
        return userContext.sub == data._id;
      },
      create: false,
      update: (userContext, data) => {
        return userContext.sub == data._id;
      },
      delete: false,
    },
    surgeries: {
      view: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      create: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      update: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      delete: false,
    },
    vaccines: {
      view: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      create: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      update: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      delete: false,
    },
    labReports: {
      view: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      create: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      update: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      delete: false,
    },
    hereditaries: {
      view: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      create: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      update: (userContext, data) => {
        return userContext.sub == data.patient;
      },
      delete: false,
    },
  },
};

export function hasPermission<Resource extends keyof Permissions>(
  userContext: UserContext,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"],
) {
  const permission = policy[userContext.role][resource]?.[action];

  if (permission == null) return false;

  if (typeof permission === "boolean") return permission;

  return data != null && permission(userContext, data);
}
