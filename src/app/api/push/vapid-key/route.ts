import { NextResponse } from "next/server";
import { isPushConfigured } from "@/lib/push-server";

export async function GET() {
  const configured = isPushConfigured();
  const publicKey = process.env.VAPID_PUBLIC_KEY ?? null;
  return NextResponse.json({
    configured,
    publicKey: configured ? publicKey : null,
  });
}
