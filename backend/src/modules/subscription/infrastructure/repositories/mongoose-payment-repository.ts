import {
  Payment,
  PaymentProps,
  PaymentStatus,
} from "../../domain/entities/payment.entity";
import { PaymentRepository } from "../../domain/repository/payment.repository";
import { PaymentModel, IPayment } from "../mongoose/payment.model";
export class MongoosePaymentRepository implements PaymentRepository {
  async save(payment: Payment): Promise<void> {
    await PaymentModel.create(payment.toObject());
  }
  async update(payment: Payment): Promise<void> {
    await PaymentModel.findByIdAndUpdate(payment.id, {
      $set: payment.toObject(),
    });
  }
  async findById(paymentId: string): Promise<Payment | null> {
    const doc = await PaymentModel.findById(paymentId);
    if (!doc) {
      return null;
    }
    return this.toEntity(doc);
  }
  async findByRazorpayOrderId(orderId: string): Promise<Payment | null> {
    const doc = await PaymentModel.findOne({
      razorpayOrderId: orderId,
    });
    if (!doc) {
      return null;
    }
    return this.toEntity(doc);
  }
  async findByRazorpayPaymentId(paymentId: string): Promise<Payment | null> {
    const doc = await PaymentModel.findOne({
      razorpayPaymentId: paymentId,
    });
    if (!doc) {
      return null;
    }
    return this.toEntity(doc);
  }
  async findByRecruiterId(recruiterId: string): Promise<Payment[]> {
    const docs = await PaymentModel.find({
      recruiterId,
    }).sort({
      createdAt: -1,
    });
    return docs.map((doc) => this.toEntity(doc));
  }
  async findBySubscriptionId(subscriptionId: string): Promise<Payment[]> {
    const docs = await PaymentModel.find({
      subscriptionId,
    }).sort({
      createdAt: -1,
    });
    return docs.map((doc) => this.toEntity(doc));
  }
  async findByStatus(status: PaymentStatus): Promise<Payment[]> {
    const docs = await PaymentModel.find({
      status,
    }).sort({
      createdAt: -1,
    });
    return docs.map((doc) => this.toEntity(doc));
  }
  async existsByOrderId(orderId: string): Promise<boolean> {
    const count = await PaymentModel.countDocuments({
      razorpayOrderId: orderId,
    });

    return count > 0;
  }

  private toEntity(doc: IPayment): Payment {
  const props: PaymentProps = {
  id: doc._id.toString(),
  recruiterId: doc.recruiterId.toString(),
  planId: doc.planId.toString(),
  durationMonths: doc.durationMonths,
  subscriptionId: doc.subscriptionId?.toString(),
  paymentType: doc.paymentType,
  amount: doc.amount,
  currency: doc.currency,
  status: doc.status,
  razorpayOrderId: doc.razorpayOrderId,
  razorpayPaymentId: doc.razorpayPaymentId,
  failureReason: doc.failureReason,
  paidAt: doc.paidAt,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
};

    return Payment.create(props);
  }
}
