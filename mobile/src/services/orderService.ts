import api from "./api";
export type Order = { _id: string; foodName: string; quantity: number; address: string; urgent: boolean; temperature: "warm" | "cold"; notes: string; status: string; createdAt: string; user?: { name: string }; deliveryGuy?: { name: string } };
export const createOrder = (payload: Omit<Order, "_id" | "status" | "createdAt" | "user" | "deliveryGuy">) => api.post("/orders", payload).then((r) => r.data.data.order as Order);
export const getMyOrders = () => api.get("/orders/my-orders").then((r) => r.data.data.orders as Order[]);
export const getAvailableOrders = () => api.get("/orders/available").then((r) => r.data.data.orders as Order[]);
export const acceptOrder = (id: string) => api.patch(`/orders/${id}/accept`).then((r) => r.data.data.order as Order);
export const getDeliveries = () => api.get("/orders/deliveries").then((r) => r.data.data as { active: Order[]; completed: Order[] });
export const updateDeliveryStatus = (id: string, status: "out_for_delivery" | "delivered") => api.patch(`/orders/${id}/status`, { status }).then((r) => r.data.data.order as Order);
