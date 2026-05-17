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
    const name = this.props.metadata?.userName;
    return typeof name === "string" ? name : this.props.userId;
  }
}