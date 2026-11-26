export interface CreateMemberInput {
  firstName: string;
  lastName: string;
  profileImage?: string;
  gender?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  occupation?: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
  source?: string;
  notes?: string;
}

export interface UpdateMemberInput {
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  gender?: string;
  dateOfBirth?: string;
  occupation?: string;
  phone?: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
  source?: string;
  notes?: string;
}

export interface MemberListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface MemberStatsResponse {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newThisMonth: number;
}
