export type MetadataValue =
  | string
  | number
  | boolean
  | null
  | MetadataValue[]
  | { [key: string]: MetadataValue };

export interface ActivityLogProps {
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, MetadataValue>;
  timestamp: string;
}

export class ActivityLog {
  public readonly props: ActivityLogProps;

  constructor(props: ActivityLogProps) {
    this.props = props;
  }

  getUserId(): string {
    return this.props.userId;
  }

  getAction(): string {
    return this.props.action;
  }

  getEntity(): string | undefined {
    return this.props.entityType;
  }

  getEntityType(): string | undefined {
    return this.props.entityType;
  }

  getEntityId(): string | undefined {
    return this.props.entityId;
  }

  getMetadata(): Record<string, MetadataValue> | undefined {
    return this.props.metadata;
  }

  getTimestamp(): string {
    return this.props.timestamp;
  }

  getUserName(): string {
    const meta = this.props.metadata;

    return (
      (meta?.recruiterName as string) ||
      (meta?.candidateName as string) ||
      (meta?.fullName as string) ||
      (meta?.userName as string) ||
      (meta?.name as string) ||
      this.props.userId
    );
  }
}