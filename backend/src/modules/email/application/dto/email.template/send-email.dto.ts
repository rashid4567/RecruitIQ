export interface SendEmailDto {
  to: string;
  subject: string;
  body: string;
  type?: "REAL" | "TEST";
}
