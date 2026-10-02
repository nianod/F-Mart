import "../global.css";
import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/services/authContext";

function RootNavigator() {
  const { user, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const group = segments[0];
    const inAuth = group === "(auth)" || !group;
    const correctHome = user?.role === "delivery" ? "/(delivery)/home" : "/(user)/home";
    if (!user && !inAuth) router.replace("/" as never);
    if (user && inAuth) router.replace(correctHome as never);
    if (user?.role === "user" && group === "(delivery)") router.replace("/(user)/home" as never);
    if (user?.role === "delivery" && group === "(user)") router.replace("/(delivery)/home" as never);
  }, [loading, segments, user]);

  if (loading) return <View className="flex-1 items-center justify-center bg-cream"><ActivityIndicator color="#15803D" /></View>;
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(user)" />
      <Stack.Screen name="(delivery)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  );
}
