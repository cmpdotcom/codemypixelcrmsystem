"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, firebaseConfig } from "@/lib/firebase";

export function FirebaseStatus() {
  const [user, setUser] = useState<User | null | "loading">("loading");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold">Firebase</h2>
      <p className="text-zinc-600 dark:text-zinc-400">
        Project: <span className="font-mono">{firebaseConfig.projectId}</span>
      </p>
      <p className="text-zinc-600 dark:text-zinc-400">
        Auth:{" "}
        {user === "loading" ? (
          "checking…"
        ) : user ? (
          <span className="font-mono">{user.email ?? user.uid}</span>
        ) : (
          "signed out"
        )}
      </p>
    </section>
  );
}
