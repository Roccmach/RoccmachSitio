import Image from "next/image";

export default function Logo() {
  return (
    <span className="logo">
      <Image src="/brand/logo-blanco.png" alt="ROCCMACH — Maquinaria Industrial" width={2250} height={646} priority />
    </span>
  );
}
