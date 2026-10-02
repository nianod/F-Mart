import { useState } from "react";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input } from "@/components/foodmart/ui";
export default function PlaceOrderScreen() {
  const [food, setFood] = useState("Jollof Rice Bowl");
  const [quantity, setQuantity] = useState("1");
  const [address, setAddress] = useState("");
  const [warm, setWarm] = useState(true);
  const [urgent, setUrgent] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    const parsedQuantity = Number(quantity);
    if (!food.trim() || !address.trim())
      return Alert.alert(
        "Almost there",
        "Please add the food and delivery address.",
      );
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 100) return Alert.alert("Check quantity", "Enter a whole number between 1 and 100.");
    try {
      setLoading(true);
      const { createOrder } = await import("@/services/orderService");
      await createOrder({ foodName: food.trim(), quantity: parsedQuantity, address: address.trim(), urgent, temperature: warm ? "warm" : "cold", notes: notes.trim() });
      Alert.alert("Order placed!", "Your order is now being prepared.", [{ text: "View orders", onPress: () => router.replace("/(user)/orders" as never) }]);
    } catch (error) {
      const { readableError } = await import("@/services/authService");
      Alert.alert("Could not place order", readableError(error));
    } finally { setLoading(false); }
  };
  const choice = (label: string, active: boolean, onPress: () => void) => (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center rounded-2xl border py-3 ${active ? "border-tomato bg-orange-50" : "border-slate-200 bg-white"}`}
    >
      <Text
        className={`font-bold ${active ? "text-tomato" : "text-slate-600"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ gap: 20, paddingHorizontal: 20, paddingBottom: 32, paddingTop: 16 }}>
        <Text onPress={() => router.back()} className="font-bold text-tomato">
          ‹ Back
        </Text>
        <View>
          <Text className="text-3xl font-extrabold text-ink">
            Place an order
          </Text>
          <Text className="mt-1 text-slate-500">
            Tell us how you like it. We’ll handle the rest.
          </Text>
        </View>
        <Input
          label="Food you’d like"
          placeholder="e.g. Jollof Rice Bowl"
          value={food}
          onChangeText={setFood}
        />
        <Input
          label="Quantity"
          placeholder="1"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <Input
          label="Delivery address"
          placeholder="House number, street, area"
          value={address}
          onChangeText={setAddress}
          multiline
        />
        <View className="gap-2">
          <Text className="text-sm font-bold text-ink">
            Temperature preference
          </Text>
          <View className="flex-row gap-3">
            {choice("🔥 Warm", warm, () => setWarm(true))}
            {choice("❄️ Cold", !warm, () => setWarm(false))}
          </View>
        </View>
        <View className="gap-2">
          <Text className="text-sm font-bold text-ink">
            Is this order urgent?
          </Text>
          <View className="flex-row gap-3">
            {choice("Yes, please", urgent, () => setUrgent(true))}
            {choice("No rush", !urgent, () => setUrgent(false))}
          </View>
        </View>
        <Input
          label="Additional instructions (optional)"
          placeholder="Allergies, landmarks, or any special requests"
          multiline
          value={notes}
          onChangeText={setNotes}
        />
        <Button label={loading ? "Placing order…" : "Place Order"} disabled={loading} onPress={submit} />
      </ScrollView>
    </SafeAreaView>
  );
}
