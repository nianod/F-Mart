import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderCard } from "@/components/foodmart/cards";
import { readableError } from "@/services/authService";
import { acceptOrder, getAvailableOrders, type Order } from "@/services/orderService";
export default function DeliveryOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(() => {
    setLoading(true);
    getAvailableOrders().then(setOrders).catch((error) => Alert.alert("Could not load orders", readableError(error))).finally(() => setLoading(false));
  }, []);
  useFocusEffect(refresh);
  const accept = async (id: string) => {
    try { await acceptOrder(id); setOrders((current) => current.filter((order) => order._id !== id)); }
    catch (error) { Alert.alert("Could not accept order", readableError(error)); }
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
        {loading ? <ActivityIndicator color="#15803D" /> : orders.length ? orders.map((order) => <OrderCard key={order._id} delivery customer={order.user?.name || "Customer"} food={`${order.foodName} · ${order.quantity}x`} status={order.status.replaceAll("_", " ")} onPrimaryAction={() => accept(order._id)} />) : <Text className="rounded-3xl bg-white p-6 text-center text-slate-500">No orders are currently available.</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}
