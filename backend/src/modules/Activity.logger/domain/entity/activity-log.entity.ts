import { ActivityActionType } from "../constants/activityActions";
import { DomainError } from "../error/domain.errors";
import { DOMAIN_ERRORS } from "../error/error.codes";

export type ActivityMetadata =
Record<
  string,
  string |
  number |
  boolean |
  null
>;

export class ActivityLog {

  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly action: ActivityActionType,
    public readonly entityType?: string,
    public readonly entityId?: string,
    public readonly metadata?:
    ActivityMetadata,
    public readonly createdAt:
    Date = new Date(),

  ) {

    if (!id.trim()) {
      throw new DomainError(
        DOMAIN_ERRORS
        .ACTIVITY_ID_REQUIRED
      );
    }
    if (!userId.trim()) {
      throw new DomainError(
        DOMAIN_ERRORS
        .USER_ID_REQUIRED
      );
    }
    if (!action.trim()) {
      throw new DomainError(
        DOMAIN_ERRORS
        .ACTIVITY_ACTION_REQUIRED
      );
    }
    if (
      entityId &&
      !entityType
    ) {
      throw new DomainError(
        DOMAIN_ERRORS
        .ENTITY_TYPE_REQUIRED
      );
    }
    if (
      entityType &&
      !entityId
    ) {
      throw new DomainError(
        DOMAIN_ERRORS
        .ENTITY_ID_REQUIRED
      );
    }
  }
  belongsToEntity(): boolean {
    return !!(
      this.entityType &&
      this.entityId
    );
  }

  belongsToUser(): boolean {
    return !!this.userId;
  }
  hasMetadata(): boolean {
    return !!(
      this.metadata &&
      Object.keys(
        this.metadata
      ).length
    );
  }

}