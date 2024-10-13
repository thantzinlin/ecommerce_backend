import mongoose, { Document, Schema } from "mongoose";

interface BillingDetails {
  billingName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingEmail: string;
  billingPhone: string;
}

interface PaymentGatewayResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  created: number;
  payment_method_details: {
    card: {
      brand: string;
      last4: string;
      exp_month: number;
      exp_year: number;
    };
  };
}

export interface PaymentDocument extends Document {
  orderId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  amount: number;
  currency: string;
  paymentDate: Date;
  paymentGatewayResponse: PaymentGatewayResponse;
  billingDetails: BillingDetails;
  shippingCost: number;
  taxAmount: number;
  discount: number;
  refundedAmount: number;
  refundDate: Date | null;
  notes: string | null;
}

// Define the Payment Schema
const PaymentSchema = new Schema<PaymentDocument>(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentGatewayResponse: {
      id: { type: String, required: true },
      status: { type: String, required: true },
      amount: { type: Number, required: true },
      currency: { type: String, required: true },
      created: { type: Number, required: true },
      payment_method_details: {
        card: {
          brand: { type: String, required: true },
          last4: { type: String, required: true },
          exp_month: { type: Number, required: true },
          exp_year: { type: Number, required: true },
        },
      },
    },
    billingDetails: {
      billingName: { type: String, required: true },
      billingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
      },
      billingEmail: { type: String, required: true },
      billingPhone: { type: String, required: true },
    },
    shippingCost: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    refundedAmount: { type: Number, default: 0 },
    refundDate: { type: Date, default: null },
    notes: { type: String, default: null },
  },
  { timestamps: true }
);

// Export the Payment model
const Payment = mongoose.model<PaymentDocument>("Payment", PaymentSchema);

export default Payment;
