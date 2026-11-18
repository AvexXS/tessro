import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams } = new URL(req.url);
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const host = req.headers.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const callbackUrl = `${protocol}://${host}/api/auth/oauth/callback?provider=${provider}&redirect=${encodeURIComponent(redirectTarget)}`;

  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      // If keys not yet supplied in .env.local, redirect with friendly notice
      return NextResponse.redirect(
        new URL(`/auth?error=google_oauth_pending&redirect=${encodeURIComponent(redirectTarget)}`, req.url)
      );
    }

    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId);
    googleAuthUrl.searchParams.set("redirect_uri", callbackUrl);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid email profile");
    googleAuthUrl.searchParams.set("access_type", "offline");
    googleAuthUrl.searchParams.set("prompt", "select_account");

    return NextResponse.redirect(googleAuthUrl.toString());
  }

  if (provider === "github") {
    const clientId = process.env.GITHUB_ID || process.env.GITHUB_CLIENT_ID;
    if (!clientId) {
      return NextResponse.redirect(
        new URL(`/auth?error=github_oauth_pending&redirect=${encodeURIComponent(redirectTarget)}`, req.url)
      );
    }

    const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
    githubAuthUrl.searchParams.set("client_id", clientId);
    githubAuthUrl.searchParams.set("redirect_uri", callbackUrl);
    githubAuthUrl.searchParams.set("scope", "user:email");

    return NextResponse.redirect(githubAuthUrl.toString());
  }

  return NextResponse.json({ error: "Unsupported OAuth provider" }, { status: 400 });
}
