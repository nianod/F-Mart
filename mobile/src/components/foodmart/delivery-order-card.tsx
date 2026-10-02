import { Text, View } from "react-native";
import { Badge, Button } from "./ui";
import type { Order } from "@/services/orderService";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Time unavailable"
    : date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function formatStatus(status: Order["status"]) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function DeliveryOrderCard({
  order,
  actionLabel,
  onAction,
  actionDisabled = false,
}: {
  order: Order;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
}) {
  const history = order.statusHistory?.length
    ? order.statusHistory
    : [{ status: order.status, at: order.createdAt }];

  return (
    <View className="gap-4 rounded-3xl bg-white p-5">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-xs font-bold uppercase text-slate-500">
            Order #{order._id.slice(-6).toUpperCase()}
          </Text>
          <Text className="mt-1 text-lg font-extrabold text-ink">
            {order.user?.name || "Customer"}
          </Text>
          <Text className="mt-1 text-sm text-slate-500">Placed {formatDate(order.createdAt)}</Text>
        </View>
        <Badge label={formatStatus(order.status)} />
      </View>

      <View className="gap-2 rounded-2xl bg-slate-50 p-4">
        <Text className="font-bold text-ink">{order.foodName} · {order.quantity}x</Text>
        <Text className="text-sm text-slate-600">Pickup temperature: {order.temperature}</Text>
        <Text className="text-sm text-slate-600">Delivery address: {order.address}</Text>
        {order.user?.phone ? <Text className="text-sm text-slate-600">Customer phone: {order.user.phone}</Text> : null}
        {order.user?.email ? <Text className="text-sm text-slate-600">Customer email: {order.user.email}</Text> : null}
        {order.urgent ? <Text className="text-sm font-bold text-tomato">Urgent delivery</Text> : null}
        {order.notes ? <Text className="text-sm text-slate-600">Notes: {order.notes}</Text> : null}
      </View>

      <View className="gap-2">
        <Text className="text-sm font-extrabold text-ink">Order timeline</Text>
        {history.map((event, index) => (
          <Text key={`${event.status}-${event.at}-${index}`} className="text-sm text-slate-600">
            {formatStatus(event.status)} · {formatDate(event.at)}
          </Text>
        ))}
      </View>

      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} disabled={actionDisabled} />
      ) : null}
    </View>
  );
}