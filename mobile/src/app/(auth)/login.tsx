import { useState } from "react";
import { router } from "expo-router";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input } from "@/components/foodmart/ui";
import { login, readableError } from "@/services/authService";
import { useAuth } from "@/services/authContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuthenticatedUser } = useAuth();
  const submit = async () => {
    if (!email || !password) return Alert.alert("Missing details", "Enter your email and password.");
    try {
      setLoading(true);
      const session = await login({ email, password });
      await setAuthenticatedUser(session.token, session.user);
      router.replace((session.user.role === "delivery" ? "/(delivery)/home" : "/(user)/home") as never);
    } catch (error) { Alert.alert("Login failed", readableError(error)); } finally { setLoading(false); }
  };
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32, gap: 20 }}>
        <Text className="text-3xl font-extrabold text-ink">
          Welcome back 👋
        </Text>
        <Text className="mt-2 text-slate-500">
          Sign in to order your favourite meals.
        </Text>
        <View className="mt-10 gap-5">
          <Input
            label="Email"
            placeholder="you@example.com"
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
            label={loading ? "Logging in…" : "Login"}
            disabled={loading}
            onPress={submit}
          />
          <Text
            onPress={() => router.push("/(auth)/register" as never)}
            className="text-center font-bold text-tomato"
          >
            Create a FoodMart account
          </Text>
          <View className="my-2 h-px bg-orange-100" />
          <Button
            label="Login as Delivery Guy"
            variant="dark"
            onPress={() => router.push("/(auth)/delivery-login" as never)}
          />
          <Text
            onPress={() => router.back()}
            className="text-center text-sm font-semibold text-slate-500"
          >
            Back to welcome
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
