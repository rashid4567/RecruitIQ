export interface ActivityLogProps {
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>; 
  timestamp: string;              
}

export class ActivityLog {
    public readonly props: ActivityLogProps
  constructor(
    props: ActivityLogProps
  ) {
    this.props = props;
  }

  getUserId() {
    return this.props.userId;
  }

  getAction() {
    return this.props.action;
  }

  getEntity() {
    return this.props.entityType;
  }

  getEntityId() {  
    return this.props.entityId;
  }

  getMetadata() {
    return this.props.metadata;
  }

  getTimestamp() {
    return this.props.timestamp;
  }

  getUserName() {
    return this.props.metadata?.userName || this.props.userId;
  }
}
