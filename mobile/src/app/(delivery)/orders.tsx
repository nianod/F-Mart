import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DeliveryOrderCard } from "@/components/foodmart/delivery-order-card";
import { Button, EmptyState } from "@/components/foodmart/ui";
import { readableError } from "@/services/authService";
import { acceptOrder, getAvailableOrders, type Order } from "@/services/orderService";

export default function DeliveryOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyOrder, setBusyOrder] = useState("");
  const refresh = useCallback(() => {
    setLoading(true);
    getAvailableOrders().then((nextOrders) => { setOrders(nextOrders); setError(""); }).catch((issue) => setError(readableError(issue))).finally(() => setLoading(false));
  }, []);
  useFocusEffect(refresh);
  const accept = async (id: string) => {
    try {
      setBusyOrder(id);
      await acceptOrder(id);
      await getAvailableOrders().then(setOrders);
    } catch (issue) {
      Alert.alert("Could not accept order", readableError(issue));
    } finally {
      setBusyOrder("");
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ gap: 20, paddingHorizontal: 20, paddingBottom: 32, paddingTop: 20 }}>
        <View>
          <Text className="text-3xl font-extrabold text-ink">
            Available orders
          </Text>
          <Text className="mt-1 text-slate-500">
            Accept an order when you’re ready.
          </Text>
        </View>
        {loading ? <ActivityIndicator color="#15803D" /> : error ? <View className="gap-3 rounded-2xl bg-white p-5"><Text className="text-slate-600">{error}</Text><Button label="Try again" variant="secondary" onPress={refresh} /></View> : orders.length ? orders.map((order) => (
          <DeliveryOrderCard key={order._id} order={order} actionLabel={busyOrder === order._id ? "Accepting…" : "Accept order"} actionDisabled={Boolean(busyOrder)} onAction={() => void accept(order._id)} />
        )) : <EmptyState icon="📦" title="No orders available" body="Orders ready for delivery will appear here." />}
      </ScrollView>
    </SafeAreaView>
  );
}
