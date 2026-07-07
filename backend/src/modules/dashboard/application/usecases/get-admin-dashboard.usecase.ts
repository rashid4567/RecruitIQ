import { IUseCase } from "../../../../shared/interfaces/usecase.interface";

import {
  AdminDashboardDTO,
  AdminDashboardRequestDTO,
} from "../dto/admin-dashboard.dto";

import { JobRepository } from "../../../job/domain/repositories/job.repository";
import { JobApplicationRepository } from "../../../job-application/domain/repository/job-application.repository";
import { RecruiterSubscriptionRepository } from "../../../subscription/domain/repository/recruiter-subscription-plan-repository";
import { ActivityLogRepository } from "../../../Activity.logger/domain/repositories/activity-log.repository";
import { RecruiterRepository } from "../../../admin/Domain/repositories/recruiter.repository";
import { CandidateRepository } from "../../../admin/Domain/repositories/candidate.repository";

export class GetAdminDashboardUseCase implements IUseCase<
  AdminDashboardRequestDTO,
  AdminDashboardDTO
> {
  constructor(
    private readonly recruiterRepository: RecruiterRepository,
    private readonly candidateRepository: CandidateRepository,
    private readonly jobRepository: JobRepository,
    private readonly applicationRepository: JobApplicationRepository,
    private readonly subscriptionRepository: RecruiterSubscriptionRepository,
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(_: AdminDashboardRequestDTO): Promise<AdminDashboardDTO> {
    const [
      recruiters,
      candidates,
      jobs,
      applications,
      subscriptions,
      activities,
    ] = await Promise.all([
      this.recruiterRepository.getRecruiters({
        skip: 0,
        limit: 1000,
      }),

      this.candidateRepository.getCandidates({
        skip: 0,
        limit: 1000,
      }),

      this.jobRepository.findAll(
        {},
        {
          page: 1,
          limit: 1000,
        },
      ),

      this.applicationRepository.findAll(),

      this.subscriptionRepository.findAll({
        page: 1,
        limit: 1000,
      }),

      this.activityLogRepository.list(),
    ]);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyRevenue = subscriptions.items
      .filter(
        (subscription) =>
          subscription.startDate.getMonth() === currentMonth &&
          subscription.startDate.getFullYear() === currentYear,
      )
      .reduce((total, subscription) => total + subscription.planPrice, 0);

    const revenueMap = new Map<
      string,
      {
        subscribers: number;
        revenue: number;
      }
    >();

    subscriptions.items.forEach((subscription) => {
      const existing = revenueMap.get(subscription.planName);

      if (existing) {
        existing.subscribers += 1;
        existing.revenue += subscription.planPrice;
      } else {
        revenueMap.set(subscription.planName, {
          subscribers: 1,
          revenue: subscription.planPrice,
        });
      }
    });

    const revenueBreakdown = [...revenueMap.entries()].map(
      ([planName, value]) => ({
        planName,
        subscribers: value.subscribers,
        revenue: value.revenue,
      }),
    );

    const monthMap = new Map<
      string,
      {
        subscriptions: number;
        revenue: number;
      }
    >();

    subscriptions.items.forEach((subscription) => {
      const month = subscription.startDate.toLocaleString("default", {
        month: "short",
      });

      const existing = monthMap.get(month);

      if (existing) {
        existing.subscriptions += 1;
        existing.revenue += subscription.planPrice;
      } else {
        monthMap.set(month, {
          subscriptions: 1,
          revenue: subscription.planPrice,
        });
      }
    });

    const subscriptionGrowth = [...monthMap.entries()].map(
      ([month, value]) => ({
        month,
        subscriptions: value.subscriptions,
        revenue: value.revenue,
      }),
    );

    const recentActivities = activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 6)
      .map((activity) => ({
        id: activity.id,
        action: activity.action,
        description: `${activity.action} ${activity.entityType ?? ""}`,
        createdAt: activity.createdAt,
      }));

    return {
      overview: {
        totalRecruiters: recruiters.total,
        totalCandidates: candidates.total,
        totalJobPosts: jobs.total,
        totalApplications: applications.length,
        monthlyRevenue,
      },
      subscriptionGrowth,
      revenueBreakdown,
      recentActivities,
    };
  }
}
