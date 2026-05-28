// export type BillingCycle = "weekly" | "monthly" | "yearly";
// export type Currency = "INR" | "USD" | "EUR" | "GBP";
// export type PlanType = "free" | "basic" | "pro" | "enterprise";

// export interface FeaturesAccess {
//   interviewScheduling: boolean;
//   advancedAnalytics: boolean;
//   prioritySupport: boolean;
// }

// export interface PlanFeature {
//   name: string;
//   included: boolean;
// }

// export interface SubscriptionPlanProps {
//   id: string;
//   name: string;
//   planType: PlanType;
//   price: number;
//   currency: Currency;
//   billingCycle: BillingCycle;
//   billingInterval: number;
//   jobPostsPerMonth: number;
//   screeningCredits: number;
//   featuresAccess: FeaturesAccess;
//   features: PlanFeature[];
//   isPopular: boolean;
//   sortOrder: number;
//   isActive: boolean;
//   description?: string;
//   razorpayPlanId?: string;
//   createdAt?: string | Date;
//   updatedAt?: string | Date;
// }

// export class SubscriptionPlan {
//   public readonly id: string;
//   public readonly name: string;
//   public readonly planType: PlanType;
//   public readonly price: number;
//   public readonly currency: Currency;
//   public readonly billingCycle: BillingCycle;
//   public readonly billingInterval: number;
//   public readonly jobPostsPerMonth: number;
//   public readonly screeningCredits: number;
//   public readonly featuresAccess: FeaturesAccess;
//   public readonly features: PlanFeature[];
//   public readonly isPopular: boolean;
//   public readonly sortOrder: number;
//   public readonly isActive: boolean;
//   public readonly description?: string;
//   public readonly razorpayPlanId?: string;
//   public readonly createdAt?: Date;
//   public readonly updatedAt?: Date;

//   private constructor(props: SubscriptionPlanProps) {
//     this.id = props.id;
//     this.name = props.name;
//     this.planType = props.planType;
//     this.price = props.price;
//     this.currency = props.currency;
//     this.billingCycle = props.billingCycle;
//     this.billingInterval = props.billingInterval;
//     this.jobPostsPerMonth = props.jobPostsPerMonth;
//     this.screeningCredits = props.screeningCredits;
//     this.featuresAccess = props.featuresAccess;
//     this.features = props.features;
//     this.isPopular = props.isPopular;
//     this.sortOrder = props.sortOrder;
//     this.isActive = props.isActive;
//     this.description = props.description;
//     this.razorpayPlanId = props.razorpayPlanId;
//     this.createdAt = props.createdAt ? new Date(props.createdAt) : new Date();
//     this.updatedAt = props.updatedAt ? new Date(props.updatedAt) : new Date();
//   }

//   static create(props: SubscriptionPlanProps): SubscriptionPlan {
//     if (!props.name || props.name.trim().length < 2) {
//       throw new Error("Invalid plan name");
//     }

//     if (props.price < 0) {
//       throw new Error("Price cannot be negative");
//     }

//     if (props.billingInterval < 1) {
//       throw new Error("Billing interval must be >= 1");
//     }

//     if (props.jobPostsPerMonth < -1) {
//       throw new Error("Invalid job post limit");
//     }

//     if (props.screeningCredits < -1) {
//       throw new Error("Invalid screening credits");
//     }

//     if (props.planType !== "free" && !props.razorpayPlanId) {
//       throw new Error("Razorpay plan ID required for paid plans");
//     }

//     return new SubscriptionPlan({
//       ...props,
//       name: props.name.trim(),
//       createdAt: props.createdAt ?? new Date(),
//       updatedAt: new Date(),
//     });
//   }

//   static fromPersistence(props: SubscriptionPlanProps): SubscriptionPlan {
//     return new SubscriptionPlan(props);
//   }

//   isFree(): boolean {
//     return this.planType === "free";
//   }

//   isPaid(): boolean {
//     return this.planType !== "free";
//   }

//   isHidden(): boolean {
//     return !this.isActive;
//   }

//   hasUnlimitedJobPosts(): boolean {
//     return this.jobPostsPerMonth === -1;
//   }

//   hasUnlimitedScreeningCredits(): boolean {
//     return this.screeningCredits === -1;
//   }

//   supportsInterviewScheduling(): boolean {
//     return this.featuresAccess.interviewScheduling;
//   }

//   supportsAdvancedAnalytics(): boolean {
//     return this.featuresAccess.advancedAnalytics;
//   }

//   hasPrioritySupport(): boolean {
//     return this.featuresAccess.prioritySupport;
//   }

//   withActiveStatus(isActive: boolean): SubscriptionPlan {
//     return new SubscriptionPlan({
//       ...this.toPrimitives(),
//       isActive,
//       updatedAt: new Date(),
//     });
//   }

//   withPopularStatus(isPopular: boolean): SubscriptionPlan {
//     return new SubscriptionPlan({
//       ...this.toPrimitives(),
//       isPopular,
//       updatedAt: new Date(),
//     });
//   }

//   getFormattedPrice(): string {
//     if (this.isFree()) return "Free";

//     const symbols: Record<Currency, string> = {
//       INR: "₹",
//       USD: "$",
//       EUR: "€",
//       GBP: "£",
//     };

//     return `${symbols[this.currency]}${this.price.toLocaleString()}`;
//   }

//   getBillingLabel(): string {
//     if (this.isFree()) return "Free";

//     const cycleLabel: Record<BillingCycle, string> = {
//       weekly: "week",
//       monthly: "month",
//       yearly: "year",
//     };

//     return `per ${cycleLabel[this.billingCycle]}`;
//   }

//   getJobPostsLabel(): string {
//     return this.hasUnlimitedJobPosts()
//       ? "Unlimited job posts"
//       : `${this.jobPostsPerMonth} job posts / month`;
//   }

//   getScreeningCreditsLabel(): string {
//     return this.hasUnlimitedScreeningCredits()
//       ? "Unlimited screening credits"
//       : `${this.screeningCredits} screening credits`;
//   }

//   getIncludedFeatures(): PlanFeature[] {
//     return this.features.filter((f) => f.included);
//   }

//   getExcludedFeatures(): PlanFeature[] {
//     return this.features.filter((f) => !f.included);
//   }

//   toPrimitives(): SubscriptionPlanProps {
//     return {
//       id: this.id,
//       name: this.name,
//       planType: this.planType,
//       price: this.price,
//       currency: this.currency,
//       billingCycle: this.billingCycle,
//       billingInterval: this.billingInterval,
//       jobPostsPerMonth: this.jobPostsPerMonth,
//       screeningCredits: this.screeningCredits,
//       featuresAccess: { ...this.featuresAccess },
//       features: [...this.features],
//       isPopular: this.isPopular,
//       sortOrder: this.sortOrder,
//       isActive: this.isActive,
//       description: this.description,
//       razorpayPlanId: this.razorpayPlanId,
//       createdAt: this.createdAt,
//       updatedAt: this.updatedAt,
//     };
//   }
// }
