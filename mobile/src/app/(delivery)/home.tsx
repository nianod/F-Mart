import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderCard } from "@/components/foodmart/cards";
import { SectionTitle } from "@/components/foodmart/ui";
const stats = [
  ["New orders", "08", "🛎️"],
  ["Pending", "03", "🛵"],
  ["Completed", "12", "✓"],
  ["Today", "15", "📦"],
];
export default function DeliveryHome() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ gap: 24, paddingHorizontal: 20, paddingBottom: 32, paddingTop: 20 }}>
        <View>
          <Text className="text-sm text-slate-500">Tuesday, 24 October</Text>
          <Text className="text-3xl font-extrabold text-ink">
            Ready to roll, Sam? 🛵
          </Text>
        </View>
        <View className="flex-row flex-wrap justify-between gap-y-3">
          {stats.map(([label, value, emoji]) => (
            <View key={label} className="w-[48%] rounded-3xl bg-white p-4">
              <Text className="text-xl">{emoji}</Text>
              <Text className="mt-3 text-2xl font-extrabold text-ink">
                {value}
              </Text>
              <Text className="text-sm text-slate-500">{label}</Text>
            </View>
          ))}
        </View>
        <View className="gap-4">
          <SectionTitle title="New orders" action="View all" />
          <OrderCard delivery />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
