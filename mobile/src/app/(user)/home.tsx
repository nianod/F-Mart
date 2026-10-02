import { router } from "expo-router";
import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FoodCard, foods } from "@/components/foodmart/cards";
import { Button, SectionTitle } from "@/components/foodmart/ui";
import { useAuth } from "@/services/authContext";
const categories = [
  ["🍕", "Pizza"],
  ["🥗", "Healthy"],
  ["🍔", "Burgers"],
  ["🍰", "Dessert"],
];
export default function UserHome() {
  const { user } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 28, paddingHorizontal: 20, paddingBottom: 32, paddingTop: 16 }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-slate-500">Good afternoon,</Text>
            <Text className="text-2xl font-extrabold text-ink">{user?.name || "FoodMart user"} 👋</Text>
          </View>
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-tomato">
            <Text>🍲</Text>
          </View>
        </View>
        <View className="flex-row items-center rounded-2xl bg-white px-4">
          <Text>⌕</Text>
          <TextInput
            placeholder="Search meals or restaurants"
            placeholderTextColor="#98A2B3"
            className="h-14 flex-1 px-3 text-base text-ink"
          />
        </View>
        <View className="overflow-hidden rounded-3xl bg-ink p-5">
          <Text className="text-sm font-bold text-orange-200">
            FOODMART SPECIAL
          </Text>
          <Text className="mt-2 text-2xl font-extrabold text-white">
            Hungry? We’ve got{`\n`}you covered.
          </Text>
          <Text className="mt-2 text-sm text-slate-300">
            Freshly made favourites, delivered fast.
          </Text>
          <View className="mt-4 self-start">
            <Button
              label="Place an order"
              onPress={() => router.push("/(user)/place-order" as never)}
            />
          </View>
        </View>
        <View className="gap-4">
          <SectionTitle title="Categories" />
          <View className="flex-row justify-between">
            {categories.map(([emoji, name]) => (
              <View key={name} className="items-center gap-2">
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
                  <Text className="text-2xl">{emoji}</Text>
                </View>
                <Text className="text-xs font-semibold text-slate-600">
                  {name}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View className="gap-4">
          <SectionTitle title="Popular near you" action="See all" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {foods.map((food) => (
              <FoodCard
                key={food.name}
                food={food}
                onOrder={() => router.push("/(user)/place-order" as never)}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
