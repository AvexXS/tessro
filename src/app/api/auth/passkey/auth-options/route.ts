import { NextResponse } from "next/server";
import { getPasskeyAuthOptions } from "@/lib/passkeys";

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));
    const { options, sessionKey } = await getPasskeyAuthOptions(email);

    return NextResponse.json({
      options,
      sessionKey,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
