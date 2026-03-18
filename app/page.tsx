"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NameGate from "@/components/NameGate";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const name = localStorage.getItem("spanishtalk_name");
    if (name) router.replace("/practice");
    else setChecking(false);
  }, [router]);

  if (checking) return null;
  return <NameGate onStart={() => router.push("/practice")} />;
}
