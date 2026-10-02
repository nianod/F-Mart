import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderCard } from "@/components/foodmart/cards";
import { Button } from "@/components/foodmart/ui";
export default function Deliveries() {
  const [active, setActive] = useState(true);
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ gap: 20, paddingHorizontal: 20, paddingBottom: 32, paddingTop: 20 }}>
        <Text className="text-3xl font-extrabold text-ink">My deliveries</Text>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              label="Active"
              variant={active ? "primary" : "secondary"}
              onPress={() => setActive(true)}
            />
          </View>
          <View className="flex-1">
            <Button
              label="Completed"
              variant={!active ? "primary" : "secondary"}
              onPress={() => setActive(false)}
            />
          </View>
        </View>
        {active ? (
          <>
            <OrderCard
              delivery
              customer="Maya Johnson"
              food="Jollof Rice Bowl · 2x"
              status="Out for Delivery"
            />
            <View className="rounded-3xl bg-white p-5">
              <Text className="font-extrabold text-ink">Next stop</Text>
              <Text className="mt-2 text-slate-600">
                📍 24 Forest Lane, Westlands
              </Text>
              <View className="mt-4">
                <Button label="Mark as Delivered" />
              </View>
            </View>
          </>
        ) : (
          <OrderCard
            delivery
            customer="Naomi Wanjiku"
            food="Garden Burger · 1x"
            status="Delivered"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
