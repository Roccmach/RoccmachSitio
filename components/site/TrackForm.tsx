"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackForm({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim().toUpperCase();
    if (v) router.push(`/seguimiento?pedido=${encodeURIComponent(v)}`);
  };

  return (
    <form className="track-form" onSubmit={submit}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ej: RM-8F3K2Q"
        aria-label="Número de pedido"
        autoCapitalize="characters"
      />
      <button type="submit" className="btn btn-red">Rastrear</button>
    </form>
  );
}
