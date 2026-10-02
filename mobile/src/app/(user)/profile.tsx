import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input } from "@/components/foodmart/ui";
import { type AuthUser } from "@/services/authStorage";
import { readableError } from "@/services/authService";
import { getProfile, updateProfile } from "@/services/userService";
import { useAuth } from "@/services/authContext";
export default function ProfileScreen() {
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { logout, updateUser } = useAuth();
  useFocusEffect(useCallback(() => { getProfile().then(setProfile).catch((error) => Alert.alert("Could not load profile", readableError(error))); }, []));
  const save = async () => {
    if (!profile?.name.trim()) return Alert.alert("Name required", "Enter your name before saving.");
    try {
      setSaving(true);
      const updated = await updateProfile({ name: profile.name.trim(), phone: profile.phone || "", address: profile.address || "", avatar: profile.avatar || "" });
      setProfile(updated);
      await updateUser(updated);
      setEditing(false);
    } catch (error) { Alert.alert("Could not save profile", readableError(error)); } finally { setSaving(false); }
  };
  const signOut = async () => { await logout(); router.replace("/" as never); };
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ gap: 20, paddingHorizontal: 20, paddingBottom: 32, paddingTop: 20 }}>
        <Text className="text-3xl font-extrabold text-ink">Profile</Text>
        <View className="items-center rounded-3xl bg-white p-6">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-orange-100">
            <Text className="text-4xl">👩🏽</Text>
          </View>
          <Text className="mt-3 text-xl font-extrabold text-ink">{profile?.name || "FoodMart user"}</Text>
          <Text className="text-slate-500">{profile?.email || "Loading profile…"}</Text>
        </View>
        <View className="gap-4 rounded-3xl bg-white p-5">
          <Text className="font-extrabold text-ink">Contact & delivery</Text>
          {editing ? <>
            <Input label="Name" placeholder="Your name" value={profile?.name || ""} onChangeText={(name) => setProfile((current) => current ? { ...current, name } : current)} />
            <Input label="Phone" placeholder="+254..." value={profile?.phone || ""} onChangeText={(phone) => setProfile((current) => current ? { ...current, phone } : current)} keyboardType="numeric" />
            <Input label="Delivery address" placeholder="House number, street, area" value={profile?.address || ""} onChangeText={(address) => setProfile((current) => current ? { ...current, address } : current)} multiline />
            <Button label={saving ? "Saving…" : "Save profile"} disabled={saving} onPress={save} />
            <Button label="Cancel" variant="secondary" onPress={() => { setEditing(false); getProfile().then(setProfile); }} />
          </> : <>
            <Text className="text-slate-600">📞 {profile?.phone || "Add your phone number"}</Text>
            <Text className="text-slate-600">📍 {profile?.address || "Add your delivery address"}</Text>
            <Text onPress={() => setEditing(true)} className="font-extrabold text-tomato">Edit profile</Text>
          </>}
        </View>
        <Button
          label="Logout"
          variant="secondary"
        onPress={signOut}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
