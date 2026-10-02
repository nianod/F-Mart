import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { DeliveryOrderCard } from "@/components/foodmart/delivery-order-card";
import { Button } from "@/components/foodmart/ui";
import { readableError } from "@/services/authService";
import { getDeliveries, updateDeliveryStatus, type Order } from "@/services/orderService";

export default function Deliveries() {
  const [active, setActive] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyOrder, setBusyOrder] = useState("");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const deliveries = await getDeliveries();
      setOrders(active ? deliveries.active : deliveries.completed);
      setError("");
    } catch (issue) {
      setError(readableError(issue));
    } finally {
      setLoading(false);
    }
  }, [active]);
  useFocusEffect(useCallback(() => { setLoading(true); void refresh(); }, [refresh]));

  const changeStatus = async (order: Order) => {
    const nextStatus = order.status === "accepted" ? "out_for_delivery" : "delivered";
    try {
      setBusyOrder(order._id);
      await updateDeliveryStatus(order._id, nextStatus);
      await refresh();
    } catch (issue) {
      Alert.alert("Could not update delivery", readableError(issue));
    } finally {
      setBusyOrder("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ gap: 20, paddingHorizontal: 20, paddingBottom: 32, paddingTop: 20 }}>
        <Text className="text-3xl font-extrabold text-ink">My deliveries</Text>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              label="Active"
              variant={active ? "primary" : "secondary"}
              onPress={() => { setActive(true); setLoading(true); }}
            />
          </View>
          <View className="flex-1">
            <Button
              label="Completed"
              variant={!active ? "primary" : "secondary"}
              onPress={() => { setActive(false); setLoading(true); }}
            />
          </View>
        </View>
        {loading ? <ActivityIndicator color="#15803D" /> : error ? <View className="gap-3 rounded-2xl bg-white p-5"><Text className="text-slate-600">{error}</Text><Button label="Try again" variant="secondary" onPress={() => { setLoading(true); void refresh(); }} /></View> : orders.length ? orders.map((order) => (
          <DeliveryOrderCard
            key={order._id}
            order={order}
            actionLabel={active ? busyOrder === order._id ? "Updating…" : order.status === "accepted" ? "Start delivery" : "Mark as delivered" : undefined}
            actionDisabled={Boolean(busyOrder)}
            onAction={active ? () => void changeStatus(order) : undefined}
          />
        )) : <Text className="rounded-3xl bg-white p-6 text-center text-slate-500">{active ? "No active deliveries assigned." : "Completed deliveries will appear here."}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}
