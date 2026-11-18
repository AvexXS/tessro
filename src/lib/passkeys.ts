import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { db, DBUser, DBPasskey } from "./db";

export const rpName = "Tessro Digital Studio";
export const rpID = process.env.RP_ID || (process.env.NODE_ENV === "production" ? "tessro.com" : "localhost");
export const origin = process.env.NEXTAUTH_URL || (process.env.NODE_ENV === "production" ? `https://${rpID}` : `http://${rpID}:3000`);

// Store active WebAuthn challenges temporarily in memory with 5-minute expiration
const challengeStore = new Map<string, { challenge: string; expiresAt: number; userId?: string }>();

export function storeChallenge(key: string, challenge: string, userId?: string) {
  challengeStore.set(key, { challenge, expiresAt: Date.now() + 5 * 60 * 1000, userId });
}

export function getChallenge(key: string): string | null {
  const data = challengeStore.get(key);
  if (!data) return null;
  if (Date.now() > data.expiresAt) {
    challengeStore.delete(key);
    return null;
  }
  challengeStore.delete(key);
  return data.challenge;
}

/**
 * Generate registration options for Face ID / Touch ID / Windows Hello
 */
export async function getPasskeyRegistrationOptions(user: DBUser) {
  const userPasskeys = await db.passkeys.findByUserId(user.id);

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: new TextEncoder().encode(user.id),
    userName: user.email,
    userDisplayName: user.name,
    attestationType: "none",
    excludeCredentials: userPasskeys.map((p) => ({
      id: p.id,
      transports: p.transports as any,
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
  });

  storeChallenge(user.id, options.challenge, user.id);
  return options;
}

/**
 * Verify registration response and save passkey credential to DB
 */
export async function verifyPasskeyRegistration(user: DBUser, response: any) {
  const expectedChallenge = getChallenge(user.id);
  if (!expectedChallenge) {
    throw new Error("Challenge expired or not found");
  }

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  if (verification.verified && verification.registrationInfo) {
    const { credential } = verification.registrationInfo;
    const regInfo = verification.registrationInfo as any;

    const passkey: DBPasskey = {
      id: credential.id,
      user_id: user.id,
      public_key: Buffer.from(credential.publicKey).toString("base64url"),
      counter: credential.counter,
      device_type: regInfo.credentialDeviceType || (credential as any).deviceType || "singleDevice",
      backed_up: regInfo.credentialBackedUp ?? (credential as any).backedUp ?? false,
      transports: credential.transports,
      created_at: new Date().toISOString(),
    };

    await db.passkeys.create(passkey);
    return { verified: true, passkey };
  }

  return { verified: false };
}

/**
 * Generate authentication options for passkey sign-in
 */
export async function getPasskeyAuthOptions(email?: string) {
  let allowCredentials: any[] | undefined = undefined;

  if (email) {
    const user = await db.users.findByEmail(email);
    if (user) {
      const passkeys = await db.passkeys.findByUserId(user.id);
      allowCredentials = passkeys.map((p) => ({
        id: p.id,
        transports: p.transports as any,
      }));
    }
  }

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials,
    userVerification: "preferred",
  });

  const sessionKey = email || options.challenge;
  storeChallenge(sessionKey, options.challenge);

  return { options, sessionKey };
}

/**
 * Verify passkey authentication response
 */
export async function verifyPasskeyAuth(response: any, sessionKey: string) {
  const expectedChallenge = getChallenge(sessionKey);
  if (!expectedChallenge) {
    throw new Error("Authentication challenge expired or invalid");
  }

  const credentialId = response.id;
  const passkey = await db.passkeys.findById(credentialId);
  if (!passkey) {
    throw new Error("Passkey credential not found");
  }

  const user = await db.users.findById(passkey.user_id);
  if (!user) {
    throw new Error("User account not found");
  }

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    credential: {
      id: passkey.id,
      publicKey: Buffer.from(passkey.public_key, "base64url"),
      counter: passkey.counter,
      transports: passkey.transports as any,
    },
  });

  if (verification.verified) {
    await db.passkeys.updateCounter(passkey.id, verification.authenticationInfo.newCounter);
    return { verified: true, user };
  }

  return { verified: false, user: null };
}
