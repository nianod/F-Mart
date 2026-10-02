import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
export default function UserTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#15803D",
        tabBarInactiveTintColor: "#737373",
        tabBarStyle: { height: 68, paddingTop: 7, backgroundColor: "#FFFFFF", borderTopColor: "#E5E5E5" },
        tabBarLabelStyle: { fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => <Ionicons name="receipt-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen name="place-order" options={{ href: null }} />
    </Tabs>
  );
}
