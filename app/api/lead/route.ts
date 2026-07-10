import { NextResponse } from "next/server";
import { isSanityConfigured } from "@/sanity/env";
import { writeClient } from "@/sanity/lib/writeClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, phone, email, city, category, modo, message, source, productSlug, productPrice } = body ?? {};

    // Validación mínima.
    if (!name || !phone) {
      return NextResponse.json({ ok: false, error: "Faltan datos" }, { status: 400 });
    }

    // Si Sanity no está configurado, no bloqueamos: el lead sigue por WhatsApp.
    if (!isSanityConfigured) {
      return NextResponse.json({ ok: true, saved: false });
    }

    await writeClient.create({
      _type: "lead",
      name: String(name).slice(0, 120),
      company: company ? String(company).slice(0, 160) : undefined,
      phone: String(phone).slice(0, 40),
      email: email ? String(email).slice(0, 160) : undefined,
      city: city ? String(city).slice(0, 160) : undefined,
      category: category ? String(category).slice(0, 60) : undefined,
      modo: modo ? String(modo).slice(0, 60) : undefined,
      message: message ? String(message).slice(0, 1000) : undefined,
      source: source ? String(source).slice(0, 60) : "web",
      productSlug: productSlug ? String(productSlug).slice(0, 120) : undefined,
      productPrice: typeof productPrice === "number" ? productPrice : undefined,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, saved: true });
  } catch (err) {
    // Nunca rompemos el flujo del usuario: aunque falle el guardado, seguirá a WhatsApp.
    console.error("[api/lead] error guardando lead:", err);
    return NextResponse.json({ ok: true, saved: false });
  }
}
