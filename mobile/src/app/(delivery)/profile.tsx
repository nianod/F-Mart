import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/foodmart/ui";
import { useAuth } from "@/services/authContext";
export default function DeliveryProfile() {
  const { logout } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ gap: 20, paddingHorizontal: 20, paddingBottom: 32, paddingTop: 20 }}>
        <Text className="text-3xl font-extrabold text-ink">Driver profile</Text>
        <View className="items-center rounded-3xl bg-ink p-6">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-orange-100">
            <Text className="text-4xl">🧑🏾</Text>
          </View>
          <Text className="mt-3 text-xl font-extrabold text-white">
            Sam Okoro
          </Text>
          <Text className="text-slate-300">sam@foodmart.com</Text>
          <Text className="mt-1 text-slate-300">+254 711 456 789</Text>
        </View>
        <View className="flex-row gap-3">
          <View className="flex-1 rounded-3xl bg-white p-4">
            <Text className="text-2xl font-extrabold text-ink">128</Text>
            <Text className="text-sm text-slate-500">Deliveries</Text>
          </View>
          <View className="flex-1 rounded-3xl bg-white p-4">
            <Text className="text-2xl font-extrabold text-ink">4.9 ★</Text>
            <Text className="text-sm text-slate-500">Rating</Text>
          </View>
        </View>
        <View className="rounded-3xl bg-white p-5">
          <Text className="font-extrabold text-ink">⚙️ Settings</Text>
        </View>
        <Button
          label="Logout"
          variant="secondary"
          onPress={async () => { await logout(); router.replace("/" as never); }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
