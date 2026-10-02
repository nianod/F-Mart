import { Text, View } from "react-native";
import { Button, Badge } from "./ui";

export const foods = [
  {
    name: "Jollof Rice Bowl",
    description: "Smoky rice, chicken & salad",
    price: "$12.50",
    emoji: "🍛",
  },
  {
    name: "Garden Burger",
    description: "Crisp greens & house fries",
    price: "$10.00",
    emoji: "🍔",
  },
  {
    name: "Chicken Wrap",
    description: "Grilled chicken, fresh herbs",
    price: "$9.50",
    emoji: "🌯",
  },
];
export function FoodCard({
  food,
  onOrder,
}: {
  food: (typeof foods)[number];
  onOrder: () => void;
}) {
  return (
    <View className="w-56 overflow-hidden rounded-3xl bg-white">
      <View className="h-28 items-center justify-center bg-orange-100">
        <Text className="text-5xl">{food.emoji}</Text>
      </View>
      <View className="gap-2 p-4">
        <Text className="text-base font-extrabold text-ink">{food.name}</Text>
        <Text className="text-xs text-slate-500">{food.description}</Text>
        <View className="flex-row items-center justify-between">
          <Text className="font-extrabold text-tomato">{food.price}</Text>
          <View className="rounded-xl bg-ink px-3 py-2">
            <Text onPress={onOrder} className="text-xs font-bold text-white">
              Order
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
export function OrderCard({
  customer = "Amina Yusuf",
  food = "Jollof Rice Bowl",
  status = "Preparing",
  delivery = false,
  onPrimaryAction,
  primaryLabel,
  address = "24 Forest Lane, Westlands",
  temperature = "warm",
  urgent = false,
}: {
  customer?: string;
  food?: string;
  status?: string;
  delivery?: boolean;
  onPrimaryAction?: () => void;
  primaryLabel?: string;
  address?: string;
  temperature?: "warm" | "cold";
  urgent?: boolean;
}) {
  return (
    <View className="gap-3 rounded-3xl bg-white p-4">
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-base font-extrabold text-ink">
            {delivery ? customer : food}
          </Text>
          <Text className="mt-1 text-sm text-slate-500">
            {delivery ? food : "2 items · 24 Oct, 12:30 PM"}
          </Text>
        </View>
        <Badge label={status} />
      </View>
      <View className="rounded-2xl bg-slate-50 p-3">
        <Text className="text-sm text-slate-600">
          📍 {address}
        </Text>
        <Text className="mt-1 text-sm text-slate-600">
          🌡️ {temperature === "warm" ? "Warm" : "Cold"}{urgent && <> · <Text className="font-bold text-tomato">Urgent</Text></>}
        </Text>
      </View>
      {delivery && (
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Button label="View Details" variant="secondary" />
          </View>
          <View className="flex-1">
            <Button label={primaryLabel || (status === "Delivered" ? "Completed" : "Accept Order")} onPress={onPrimaryAction} />
          </View>
        </View>
      )}
    </View>
  );
}
