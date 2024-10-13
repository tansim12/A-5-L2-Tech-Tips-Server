export interface TSignIn {
  email: string;
  password: string;
}

export interface TChangePassword {
  id?: string;
  oldPassword: string;
  newPassword: string;
  email?: string;
}
