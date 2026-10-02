import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { DeliveryOrderCard } from "@/components/foodmart/delivery-order-card";
import { Button, EmptyState } from "@/components/foodmart/ui";
import { readableError } from "@/services/authService";
import { acceptOrder, getAvailableOrders, getDeliveries, type Order } from "@/services/orderService";
import { useAuth } from "@/services/authContext";

function wasDeliveredToday(order: Order) {
  const deliveredAt = order.statusHistory?.find((event) => event.status === "delivered")?.at || order.updatedAt;
  return order.status === "delivered" && deliveredAt && new Date(deliveredAt).toDateString() === new Date().toDateString();
}

export default function DeliveryHome() {
  const { user } = useAuth();
  const [available, setAvailable] = useState<Order[]>([]);
  const [active, setActive] = useState<Order[]>([]);
  const [completed, setCompleted] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyOrder, setBusyOrder] = useState("");
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    try {
      const [availableOrders, deliveries] = await Promise.all([getAvailableOrders(), getDeliveries()]);
      setAvailable(availableOrders);
      setActive(deliveries.active);
      setCompleted(deliveries.completed);
      setError("");
    } catch (issue) {
      setError(readableError(issue));
    } finally {
      setLoading(false);
    }
  }, []);
  useFocusEffect(useCallback(() => { setLoading(true); void refresh(); }, [refresh]));

  const accept = async (id: string) => {
    try {
      setBusyOrder(id);
      await acceptOrder(id);
      await refresh();
    } catch (issue) {
      Alert.alert("Could not accept order", readableError(issue));
    } finally {
      setBusyOrder("");
    }
  };

  const stats = [
    ["Available orders", String(available.length)],
    ["Active deliveries", String(active.length)],
    ["Delivered today", String(completed.filter(wasDeliveredToday).length)],
  ];

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ gap: 24, paddingHorizontal: 20, paddingBottom: 32, paddingTop: 20 }}>
        <View>
          <Text className="text-sm text-slate-500">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</Text>
          <Text className="mt-1 text-3xl font-extrabold text-ink">{user?.name ? `Ready to roll, ${user.name.split(" ")[0]}?` : "Delivery overview"}</Text>
        </View>
        <View className="flex-row flex-wrap gap-3">
          {stats.map(([label, value]) => (
            <View key={label} className="min-w-[30%] flex-1 rounded-2xl bg-white p-4">
              <Text className="text-2xl font-extrabold text-ink">{value}</Text>
              <Text className="mt-1 text-sm text-slate-500">{label}</Text>
            </View>
          ))}
        </View>
        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-extrabold text-ink">Available orders</Text>
            <Pressable onPress={() => router.push("/(delivery)/orders" as never)} accessibilityRole="button">
              <Text className="font-bold text-tomato">View all</Text>
            </Pressable>
          </View>
          {loading ? <ActivityIndicator color="#15803D" /> : error ? <View className="gap-3"><Text className="text-slate-600">{error}</Text><Button label="Try again" variant="secondary" onPress={() => { setLoading(true); void refresh(); }} /></View> : available.length ? available.slice(0, 3).map((order) => (
            <DeliveryOrderCard key={order._id} order={order} actionLabel={busyOrder === order._id ? "Accepting…" : "Accept order"} actionDisabled={Boolean(busyOrder)} onAction={() => void accept(order._id)} />
          )) : <EmptyState icon="📦" title="No orders available" body="New orders will appear here when they are ready for delivery." />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
