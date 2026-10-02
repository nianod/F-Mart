import { useState } from "react";
import { router } from "expo-router";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input } from "@/components/foodmart/ui";
import { readableError, register } from "@/services/authService";
import { useAuth } from "@/services/authContext";
export default function RegisterScreen() {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [confirmPassword, setConfirmPassword] = useState(""); const [loading, setLoading] = useState(false);
  const { setAuthenticatedUser } = useAuth();
  const submit = async () => { if (!name || !email || !password) return Alert.alert("Missing details", "Complete all required fields."); if (password !== confirmPassword) return Alert.alert("Passwords do not match", "Please confirm your password."); try { setLoading(true); const session = await register({ name, email, password }); await setAuthenticatedUser(session.token, session.user); router.replace("/(user)/home" as never); } catch (error) { Alert.alert("Registration failed", readableError(error)); } finally { setLoading(false); } };
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32, gap: 20 }}>
        <Text className="text-3xl font-extrabold text-ink">Create account</Text>
        <Text className="mt-2 text-slate-500">
          A few details and delicious food awaits.
        </Text>
        <View className="mt-8 gap-4">
          <Input label="Full name" placeholder="Your full name" value={name} onChangeText={setName} />
          <Input
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Password"
            placeholder="Create a password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Input
            label="Confirm password"
            placeholder="Confirm your password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Button
            label={loading ? "Creating account…" : "Create Account"}
            disabled={loading}
            onPress={submit}
          />
          <Text
            onPress={() => router.back()}
            className="text-center font-bold text-tomato"
          >
            Back to Login
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
