"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, hydrateAuth, login } from "@/store/slices/authSlice";

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, hydrated, loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("admin@gdmspl.com");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace("/admin");
    }
  }, [hydrated, isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      router.replace("/admin");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0f10] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#17171a] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">GDMSPL</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Admin Portal</h1>
          <p className="mt-2 text-sm text-white/45">Sign in to manage team, projects & careers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0f0f10] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
              placeholder="admin@gdmspl.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0f0f10] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
