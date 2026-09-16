export interface AdminUser {
  id: string;
  name: string;
  email: string;

  role:
    | 'SUPER_ADMIN'
    | 'ADMIN'
    | 'EDITOR';
}