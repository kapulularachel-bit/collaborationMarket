import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-4 py-4">
        <Text className="text-2xl font-bold text-slate-900">Products</Text>
        <Text className="mt-1 text-sm text-slate-500">
          Product catalog — ported in branch 6.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
