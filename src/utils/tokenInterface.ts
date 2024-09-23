export interface Token {
  id: string;
  iat?: number; // Issued at (JWT automatically adds this field)
  exp?: number;
}
