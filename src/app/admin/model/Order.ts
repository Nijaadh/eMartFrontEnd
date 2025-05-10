import { OrderItem } from "./OrderItem";

export interface Order {
    id: number;
    userId: number;
    orderStatus: string;
    paymentStatus?: string;
    paymentMethod?: string;
    totalPrice: number;
    receiverName?: string;
    receiverPhone?: string;
    receiverAddress: string;
    zip: string;
    cancelReason?: string;
    orderItems: OrderItem[];
    createdAt: string;
    updatedAt: string;
  }