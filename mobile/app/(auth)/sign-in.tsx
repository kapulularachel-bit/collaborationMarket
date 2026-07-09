import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function SignInScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50 px-6">
      <View className="w-full max-w-sm">
        <View className="mb-8 items-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-gula-green">
            <Text className="text-3xl">🥗</Text>
          </View>
          <Text className="text-2xl font-bold text-slate-900">GULA Marketplace</Text>
          <Text className="mt-1 text-sm text-slate-500">
            Sign in to manage your campus shop
          </Text>
        </View>

        <View className="space-y-3">
          <View>
            <Text className="mb-1.5 text-xs font-semibold text-slate-500">Email</Text>
            <View className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <Text className="text-sm text-slate-400">Clerk sign-in goes here</Text>
            </View>
          </View>
          <View>
            <Text className="mb-1.5 text-xs font-semibold text-slate-500">Password</Text>
            <View className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <Text className="text-sm text-slate-400">Clerk sign-in goes here</Text>
            </View>
          </View>
        </View>

        <Pressable className="mt-6 items-center rounded-xl bg-gula-green py-3.5">
          <Text className="text-sm font-bold text-white">Sign In</Text>
        </Pressable>

        <Link href="/(auth)/sign-up" className="mt-4 text-center text-sm text-gula-green">
          Don't have an account? Sign up
        </Link>
      </View>
    </View>
  );
}
