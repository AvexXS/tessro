import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signSession, hashPassword } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const provider = searchParams.get("provider");
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const host = req.headers.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const callbackUrl = `${protocol}://${host}/api/auth/oauth/callback?provider=${provider}&redirect=${encodeURIComponent(redirectTarget)}`;

  if (!code || !provider) {
    return NextResponse.redirect(new URL(`/auth?error=oauth_missing_code`, req.url));
  }

  try {
    let email = "";
    let name = "";
    let avatar = "";

    // 1. Google OAuth Token Exchange
    if (provider === "google") {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error("Google OAuth credentials missing on server");
      }

      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: callbackUrl,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok || !tokenData.access_token) {
        throw new Error(tokenData.error_description || "Google token exchange failed");
      }

      const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      const userData = await userRes.json();
      email = userData.email;
      name = userData.name || email.split("@")[0];
      avatar = userData.picture;
    }

    // 2. GitHub OAuth Token Exchange
    else if (provider === "github") {
      const clientId = process.env.GITHUB_ID || process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error("GitHub OAuth credentials missing on server");
      }

      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: callbackUrl,
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok || !tokenData.access_token) {
        throw new Error(tokenData.error_description || "GitHub token exchange failed");
      }

      const userRes = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "User-Agent": "Tessro-Studio-Auth",
        },
      });

      const userData = await userRes.json();
      name = userData.name || userData.login;
      avatar = userData.avatar_url;
      email = userData.email;

      // If email is private, fetch from emails endpoint
      if (!email) {
        const emailsRes = await fetch("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "User-Agent": "Tessro-Studio-Auth",
          },
        });
        const emailsData = await emailsRes.json();
        if (Array.isArray(emailsData)) {
          const primaryEmail = emailsData.find((e: any) => e.primary && e.verified) || emailsData[0];
          email = primaryEmail?.email;
        }
      }
    }

    if (!email) {
      throw new Error("Could not retrieve verified email from OAuth provider");
    }

    // 3. Upsert user in database
    let user = await db.users.findByEmail(email);
    if (!user) {
      user = await db.users.create({
        email,
        name: name || email.split("@")[0],
        password_hash: hashPassword(Math.random().toString(36)),
        role: "client",
        avatar: avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
        email_verified: true,
      });
      await db.logs.log("OAUTH_SIGNUP", `New user created via ${provider}: ${email}`, user.id);
    } else {
      await db.users.update(user.id, { email_verified: true, avatar: avatar || user.avatar });
      await db.logs.log("OAUTH_LOGIN", `User signed in via ${provider}: ${email}`, user.id);
    }

    // 4. Issue JWT Session Cookie
    const token = await signSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    });

    const response = NextResponse.redirect(new URL(redirectTarget, req.url));
    response.cookies.set("tessro_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("[OAuth Error]:", err);
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(err.message || "oauth_failed")}&redirect=${encodeURIComponent(redirectTarget)}`, req.url)
    );
  }
}
