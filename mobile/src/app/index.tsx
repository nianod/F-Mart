import { router } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/foodmart/ui";

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 justify-between px-6 pb-8 pt-10">
        <View className="flex-row items-center gap-2">
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-tomato">
            <Text className="text-xl">🍲</Text>
          </View>
          <Text className="text-2xl font-extrabold tracking-tight text-ink">
            FoodMart
          </Text>
        </View>
        <View>
          <View className="mb-8 h-64 items-center justify-center rounded-[42px] bg-orange-100">
            <Text className="text-8xl">🥗</Text>
            <View className="absolute bottom-5 rounded-full bg-white px-4 py-2">
              <Text className="font-bold text-ink">
                Fresh food, at your door
              </Text>
            </View>
          </View>
          <Text className="text-4xl font-extrabold leading-tight text-ink">
            Good food{"\n"}makes good days.
          </Text>
          <Text className="mt-4 text-base leading-6 text-slate-500">
            Discover local favourites and have a delicious meal delivered with
            care.
          </Text>
        </View>
        <View className="gap-3">
          <Button
            label="Order Food"
            onPress={() => router.push("/(auth)/login" as never)}
          />
          <Button
            label="I already have an account"
            variant="secondary"
            onPress={() => router.push("/(auth)/login" as never)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
