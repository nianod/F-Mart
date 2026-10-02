import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderCard } from "@/components/foodmart/cards";
import { EmptyState } from "@/components/foodmart/ui";
import { getMyOrders, type Order } from "@/services/orderService";
import { readableError } from "@/services/authService";
export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useFocusEffect(useCallback(() => { setLoading(true); setError(""); getMyOrders().then(setOrders).catch((issue) => setError(readableError(issue))).finally(() => setLoading(false)); }, []));
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ gap: 20, paddingHorizontal: 20, paddingBottom: 32, paddingTop: 20 }}>
        <View>
          <Text className="text-3xl font-extrabold text-ink">Your orders</Text>
          <Text className="mt-1 text-slate-500">
            Track every bite from kitchen to door.
          </Text>
        </View>
        {loading ? <ActivityIndicator color="#15803D" /> : error ? <EmptyState icon="⚠️" title="Could not load orders" body={error} /> : orders.length ? (
          orders.map((order) => <OrderCard key={order._id} food={`${order.foodName} · ${order.quantity}x`} status={order.status.replaceAll("_", " ")} address={order.address} temperature={order.temperature} urgent={order.urgent} />)
        ) : (
          <EmptyState
            title="No orders yet"
            body="Your delicious orders will appear here."
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
