export class ActivityLog {
  constructor(
    public readonly userId: string,
    public readonly action: string,
    public readonly entityType?: string,
    public readonly entityId?: string,
    public readonly metadata?: Record<string, any>,
    public readonly timestamp?: Date
  ) {}
}
