export interface UserProfileResponse {
  id: string;
  gymId: string;
  fullName: string;
  email: string;
  mobile?: string | null;
  status: string;
  roles: string[];
  permissions: string[];
}

export interface LoginResponseData {
  user: UserProfileResponse;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
