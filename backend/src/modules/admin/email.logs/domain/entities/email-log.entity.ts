export class EmailLog {
  constructor(
    public readonly type: "TEST" | "REAL",
    public readonly to: string,
    public readonly subject: string,
    public readonly status: "SENT" | "FAILED",
    public readonly timestamp: string,        
    public readonly error?: string
  ) {}
}
