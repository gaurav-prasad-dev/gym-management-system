export interface CreateStaffInput {
  fullName: string;
  email: string;
  mobile?: string;
  password?: string;
  designation?: string;
  joiningDate?: string; // YYYY-MM-DD
  salary?: number;
  roleIds?: string[];
}

export interface UpdateStaffInput {
  fullName?: string;
  mobile?: string;
  designation?: string;
  joiningDate?: string;
  salary?: number;
}

export interface UpdateStaffStatusInput {
  status: 'active' | 'inactive';
}

export interface AssignStaffRolesInput {
  roleIds: string[];
}

export interface StaffFilterQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}
