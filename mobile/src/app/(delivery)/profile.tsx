import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input } from "@/components/foodmart/ui";
import { readableError } from "@/services/authService";
import { useAuth } from "@/services/authContext";
import { type AuthUser } from "@/services/authStorage";
import { getProfile, updateProfile } from "@/services/userService";
import { getDeliveries } from "@/services/orderService";

export default function DeliveryProfile() {
  const { logout, updateUser } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const refresh = useCallback(async () => {
    try {
      const [user, deliveries] = await Promise.all([getProfile(), getDeliveries()]);
      setProfile(user);
      setCompletedCount(deliveries.completed.filter((order) => order.status === "delivered").length);
    } catch (error) {
      Alert.alert("Could not load profile", readableError(error));
    } finally {
      setLoading(false);
    }
  }, []);
  useFocusEffect(useCallback(() => { setLoading(true); void refresh(); }, [refresh]));

  const save = async () => {
    if (!profile?.name.trim()) return Alert.alert("Name required", "Enter your name before saving.");
    try {
      setSaving(true);
      const updated = await updateProfile({ name: profile.name.trim(), phone: profile.phone || "", address: profile.address || "", avatar: profile.avatar || "" });
      setProfile(updated);
      await updateUser(updated);
      setEditing(false);
    } catch (error) {
      Alert.alert("Could not save profile", readableError(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ gap: 20, paddingHorizontal: 20, paddingBottom: 32, paddingTop: 20 }}>
        <Text className="text-3xl font-extrabold text-ink">Driver profile</Text>
        {loading ? <ActivityIndicator color="#15803D" /> : <View className="items-center rounded-3xl bg-ink p-6">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-orange-100"><Text className="text-4xl">{profile?.avatar || "🧑🏾"}</Text></View>
          <Text className="mt-3 text-xl font-extrabold text-white">{profile?.name || "Delivery partner"}</Text>
          <Text className="text-slate-300">{profile?.email || ""}</Text>
          <Text className="mt-1 text-slate-300">{profile?.phone || "Phone not added"}</Text>
        </View>}
        <View className="flex-row gap-3">
          <View className="flex-1 rounded-3xl bg-white p-4">
            <Text className="text-2xl font-extrabold text-ink">{completedCount}</Text>
            <Text className="text-sm text-slate-500">Deliveries</Text>
          </View>
        </View>
        <View className="gap-4 rounded-3xl bg-white p-5">
          <Text className="font-extrabold text-ink">Contact details</Text>
          {editing ? <>
            <Input label="Name" placeholder="Your name" value={profile?.name || ""} onChangeText={(name) => setProfile((current) => current ? { ...current, name } : current)} />
            <Input label="Phone" placeholder="Your phone number" value={profile?.phone || ""} onChangeText={(phone) => setProfile((current) => current ? { ...current, phone } : current)} keyboardType="numeric" />
            <Input label="Address" placeholder="Your address" value={profile?.address || ""} onChangeText={(address) => setProfile((current) => current ? { ...current, address } : current)} multiline />
            <Button label={saving ? "Saving…" : "Save profile"} disabled={saving} onPress={() => void save()} />
            <Button label="Cancel" variant="secondary" onPress={() => { setEditing(false); void refresh(); }} />
          </> : <>
            <Text className="text-slate-600">Email: {profile?.email || "Not available"}</Text>
            <Text className="text-slate-600">Phone: {profile?.phone || "Add your phone number"}</Text>
            <Text className="text-slate-600">Address: {profile?.address || "Add your address"}</Text>
            <Text onPress={() => setEditing(true)} className="font-extrabold text-tomato">Edit profile</Text>
          </>}
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
