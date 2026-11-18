import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";
import { currentUser as getClerkUser } from "@clerk/nextjs/server";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "tessro-ultra-secure-jwt-secret-key-32-chars-min!";
const key = new TextEncoder().encode(JWT_SECRET);

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: "client" | "staff" | "admin";
  avatar?: string;
  title?: string;
  clerkId?: string;
}

/**
 * Hash a password using PBKDF2 with SHA-256 (tamper-proof, zero external C++ deps)
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha256").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const testHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha256").toString("hex");
    return testHash === key;
  } catch {
    return false;
  }
}

/**
 * Sign JWT token for user session
 */
export async function signSession(user: UserSession): Promise<string> {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    title: user.title,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

/**
 * Verify JWT token
 */
export async function verifySession(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as UserSession;
  } catch {
    return null;
  }
}

/**
 * Get current session from Clerk Authentication OR legacy Next.js session cookies
 * Automatically synchronizes profile pictures, names, and grants Founder & CEO / CTO role to first user!
 */
export async function getCurrentSession(req?: Request): Promise<UserSession | null> {
  // 1. Check traditional Tessro JWT session (from cookies or Authorization header)
  let token: string | undefined;

  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get("tessro_session")?.value;
    } catch {
      // Cookies not accessible in current context
    }
  }

  if (token) {
    const session = await verifySession(token);
    if (session) return session;
  }

  // 2. Check Clerk authenticated user
  try {
    const clerkUser = await getClerkUser();
    if (clerkUser) {
      const email =
        clerkUser.primaryEmailAddress?.emailAddress ||
        clerkUser.emailAddresses?.[0]?.emailAddress ||
        `${clerkUser.id}@clerk.user`;

      const name =
        clerkUser.fullName ||
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
        clerkUser.username ||
        "Tessro Member";

      const avatar = clerkUser.imageUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`;

      // Check if user exists in DB
      let dbUser = await db.users.findByEmail(email);

      // Check if this user is the FIRST registered user / owner
      // Rule: "the first user that signs up becomes the cto/ceo owner admin role in the dashboard"
      const allUsers = await db.users.getAll();
      const existingClerkOrRealAdmins = allUsers.filter(
        (u) => u.role === "admin" && (u.id.startsWith("user_") || u.email === email)
      );
      const isFirstOwner = existingClerkOrRealAdmins.length === 0;

      if (!dbUser) {
        dbUser = await db.users.create({
          id: clerkUser.id,
          email,
          name,
          role: isFirstOwner ? "admin" : "client",
          avatar,
          email_verified: true,
          password_hash: "CLERK_OAUTH_AUTHENTICATED",
        });
      } else {
        // Keep profile picture & name matched to Clerk at all times!
        const updates: any = {};
        if (dbUser.avatar !== avatar) updates.avatar = avatar;
        if (dbUser.name !== name) updates.name = name;
        if (isFirstOwner && dbUser.role !== "admin") updates.role = "admin";

        if (Object.keys(updates).length > 0) {
          await db.users.update(dbUser.id, updates);
          if (updates.avatar) dbUser.avatar = avatar;
          if (updates.name) dbUser.name = name;
          if (updates.role) dbUser.role = updates.role;
        }
      }

      return {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        avatar: dbUser.avatar || avatar,
        title: dbUser.role === "admin" ? "Founder & CEO / CTO" : "Studio Client",
        clerkId: clerkUser.id,
      };
    }
  } catch {
    // Clerk not loaded or unauthenticated
  }

  return null;
}
