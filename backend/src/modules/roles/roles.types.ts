export interface CreateRoleInput {
  name: string;
  description?: string;
  permissionIds?: string[];
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  status?: string;
}

export interface AssignRolePermissionsInput {
  permissionIds: string[];
}

export interface RoleListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
  isProtected: boolean;
  status: string;
  permissionsCount: number;
  usersCount: number;
  createdAt: Date;
  updatedAt: Date;
}
