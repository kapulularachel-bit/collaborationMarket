import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useTheme } from "../lib/ThemeContext";
import { Sun, Moon } from "lucide-react";

type Mode = "signin" | "signup";

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (mode === "signin") {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      if (password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
      const { error } = await signUp(email, password, fullName);
      if (error) setError(error);
    }
    setLoading(false);
  };

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gula-50 via-slate-50 to-emerald-50 px-4 dark:from-gula-950 dark:via-slate-950 dark:to-emerald-950">
      <button onClick={toggleTheme} className="absolute right-4 top-4 rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gula-600 shadow-lg shadow-gula-600/30">
            <span className="text-3xl font-bold text-white">G</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">GULA Marketplace</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {mode === "signin" ? "Sign in to your account" : "Join the campus marketplace"}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className={inputCls} placeholder="Brenda Mwangi" />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} placeholder="you@university.ac.ke" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputCls} placeholder="••••••••" />
            </div>
            {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-400">{error}</div>}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-gula-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gula-700 disabled:opacity-50">
              {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
            {mode === "signin" ? (
              <>Don't have an account?{" "}<button onClick={() => setMode("signup")} className="font-semibold text-gula-600 hover:underline dark:text-gula-400">Sign up</button></>
            ) : (
              <>Already have an account?{" "}<button onClick={() => setMode("signin")} className="font-semibold text-gula-600 hover:underline dark:text-gula-400">Sign in</button></>
            )}
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          Demo: <span className="font-mono">brenda@gula.demo</span> / <span className="font-mono">demo123456</span>
          {" · "}admin: <span className="font-mono">admin@gula.demo</span> / <span className="font-mono">admin123456</span>
        </p>
      </div>
    </div>
  );
}
