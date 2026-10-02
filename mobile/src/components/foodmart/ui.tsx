import type { ReactNode } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "dark";
  disabled?: boolean;
}) {
  const tone =
    variant === "primary"
      ? "bg-tomato"
      : variant === "dark"
        ? "bg-ink"
        : "border border-orange-200 bg-white";
  const text = variant === "secondary" ? "text-tomato" : "text-white";
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`min-h-14 items-center justify-center rounded-2xl px-5 ${tone} ${disabled ? "opacity-50" : ""}`}
    >
      <Text className={`text-base font-extrabold ${text}`}>{label}</Text>
    </Pressable>
  );
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  multiline,
  keyboardType = "default",
}: {
  label: string;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
}) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-bold text-ink">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#98A2B3"
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize="none"
        className={`rounded-2xl border border-slate-200 bg-white px-4 text-base text-ink ${multiline ? "min-h-24 pt-4" : "h-14"}`}
      />
    </View>
  );
}

export function Screen({ children }: { children: ReactNode }) {
  return <View className="flex-1 bg-cream">{children}</View>;
}
export function Badge({ label }: { label: string }) {
  const style =
    label.includes("Delivered") || label.includes("Completed")
      ? "bg-emerald-100 text-emerald-700"
      : label.includes("Ready") || label.includes("Delivery")
        ? "bg-green-100 text-green-700"
        : "bg-orange-100 text-orange-700";
  return (
    <View className="self-start rounded-full px-3 py-1">
      <Text className={`text-xs font-bold ${style}`}>{label}</Text>
    </View>
  );
}
export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: string;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-xl font-extrabold text-ink">{title}</Text>
      {action && <Text className="font-bold text-tomato">{action}</Text>}
    </View>
  );
}
export function EmptyState({
  icon = "🍽️",
  title,
  body,
}: {
  icon?: string;
  title: string;
  body: string;
}) {
  return (
    <View className="items-center rounded-3xl border border-dashed border-orange-200 bg-white px-7 py-12">
      <Text className="text-5xl">{icon}</Text>
      <Text className="mt-4 text-lg font-extrabold text-ink">{title}</Text>
      <Text className="mt-2 text-center leading-5 text-slate-500">{body}</Text>
    </View>
  );
}
