import { useState } from "react";
import { router } from "expo-router";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input } from "@/components/foodmart/ui";
import { login, readableError } from "@/services/authService";
import { useAuth } from "@/services/authContext";
export default function DeliveryLoginScreen() {
  const [email, setEmail] = useState(process.env.EXPO_PUBLIC_DELIVERY_EMAIL || "delivery@example.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuthenticatedUser } = useAuth();
  const submit = async () => {
    if (!email.trim() || !password) return Alert.alert("Missing details", "Enter your email and password.");
    try {
      setLoading(true);
      const session = await login({ email: email.trim().toLowerCase(), password });
      if (session.user.role !== "delivery") {
        return Alert.alert("Delivery account required", "This account is not registered as a delivery partner.");
      }
      await setAuthenticatedUser(session.token, session.user);
      router.replace("/(delivery)/home" as never);
    } catch (error) {
      Alert.alert("Login failed", readableError(error));
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-ink">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 48, gap: 20 }}>
        <Text className="text-3xl font-extrabold text-white">
          Delivery portal
        </Text>
        <Text className="mt-2 text-slate-300">
          Sign in to manage your FoodMart deliveries.
        </Text>
        <View className="mt-10 gap-5 rounded-3xl bg-cream p-5">
          <Input
            label="Email"
            placeholder="delivery@example.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button
            label={loading ? "Logging in…" : "Login to dashboard"}
            disabled={loading}
            onPress={submit}
          />
          <Text
            onPress={() => router.back()}
            className="text-center font-bold text-tomato"
          >
            Back
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
