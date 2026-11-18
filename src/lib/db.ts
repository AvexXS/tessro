import fs from "fs";
import path from "path";
import { Pool } from "pg";
import { hashPassword } from "./auth";

export interface DBUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: "client" | "staff" | "admin";
  avatar?: string;
  email_verified?: boolean;
  created_at: string;
}

export interface DBTicket {
  id: string;
  title: string;
  description: string;
  category: "Design" | "Development" | "Revision" | "Adeline Bug" | "Billing";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "review" | "resolved";
  client_id: string;
  client_name?: string;
  assigned_to?: string;
  assigned_name?: string;
  figma_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DBMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: "client" | "staff" | "admin";
  message: string;
  attachment_url?: string;
  created_at: string;
}

export interface DBAdelineProject {
  id: string;
  user_id: string;
  title: string;
  archetype: string;
  prompt: string;
  html_code: string;
  css_code: string;
  preview_url?: string;
  status: "generating" | "completed" | "error";
  created_at: string;
}

export interface DBActivityLog {
  id: string;
  user_id?: string;
  action: string;
  details: string;
  ip_address?: string;
  created_at: string;
}

export interface DBVerificationCode {
  id: string;
  email: string;
  code: string;
  expires_at: number; // timestamp in ms
  created_at: string;
}

export interface DBPasskey {
  id: string; // Base64URL-encoded credential ID
  user_id: string;
  public_key: string; // Base64URL-encoded public key
  counter: number;
  device_type: string;
  backed_up: boolean;
  transports?: string[];
  created_at: string;
}

export interface DBCoupon {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  applicable_to: "all" | "reels" | "adeline" | "studio";
  max_uses?: number;
  used_count: number;
  valid_until?: string;
  min_order_amount?: number;
  active: boolean;
  created_at: string;
}

interface DBStore {
  users: DBUser[];
  tickets: DBTicket[];
  messages: DBMessage[];
  projects: DBAdelineProject[];
  logs: DBActivityLog[];
  verificationCodes: DBVerificationCode[];
  passkeys: DBPasskey[];
  coupons: DBCoupon[];
}

// Database connection pool for PostgreSQL when DATABASE_URL is present
let pool: Pool | null = null;
if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
    });
  } catch (err) {
    console.error("[Tessro DB] Error initializing Postgres pool:", err);
  }
}

// Persistent Local JSON DB Fallback for dev and local execution
const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "tessro-db.json");

function ensureLocalStore(): DBStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialStore: DBStore = {
      users: [
        {
          id: "usr_admin_01",
          email: "admin@tessro.com",
          password_hash: hashPassword("admin123"),
          name: "Chief Operations (Admin)",
          role: "admin",
          email_verified: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "usr_staff_01",
          email: "designer@tessro.com",
          password_hash: hashPassword("staff123"),
          name: "Elena Rostova (Staff Designer)",
          role: "staff",
          email_verified: true,
          created_at: new Date().toISOString(),
        },
      ],
      tickets: [],
      messages: [],
      projects: [],
      logs: [
        {
          id: "log_1",
          user_id: "usr_admin_01",
          action: "SYSTEM_INITIALIZED",
          details: "Tessro full-stack backend initialized with unified persistence.",
          created_at: new Date().toISOString(),
        },
      ],
      verificationCodes: [],
      passkeys: [],
      coupons: [
        {
          id: "cpn_launch50",
          code: "LAUNCH50",
          discount_type: "percent",
          discount_value: 50,
          applicable_to: "all",
          max_uses: 1000,
          used_count: 24,
          valid_until: "2027-12-31T23:59:59Z",
          min_order_amount: 0,
          active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "cpn_viral20",
          code: "VIRAL20",
          discount_type: "fixed",
          discount_value: 20,
          applicable_to: "all",
          max_uses: 500,
          used_count: 82,
          valid_until: "2027-12-31T23:59:59Z",
          min_order_amount: 20,
          active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "cpn_adeline100",
          code: "ADELINE",
          discount_type: "percent",
          discount_value: 100,
          applicable_to: "all",
          max_uses: 100,
          used_count: 45,
          valid_until: "2027-12-31T23:59:59Z",
          min_order_amount: 0,
          active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "cpn_tessro10",
          code: "TESSRO10",
          discount_type: "percent",
          discount_value: 10,
          applicable_to: "all",
          max_uses: 10000,
          used_count: 310,
          valid_until: "2027-12-31T23:59:59Z",
          min_order_amount: 0,
          active: true,
          created_at: new Date().toISOString(),
        },
      ],
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialStore, null, 2), "utf8");
    return initialStore;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed.verificationCodes) parsed.verificationCodes = [];
    if (!parsed.passkeys) parsed.passkeys = [];
    if (!parsed.coupons || parsed.coupons.length === 0) {
      parsed.coupons = [
        {
          id: "cpn_launch50",
          code: "LAUNCH50",
          discount_type: "percent",
          discount_value: 50,
          applicable_to: "all",
          max_uses: 1000,
          used_count: 24,
          valid_until: "2027-12-31T23:59:59Z",
          min_order_amount: 0,
          active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "cpn_viral20",
          code: "VIRAL20",
          discount_type: "fixed",
          discount_value: 20,
          applicable_to: "all",
          max_uses: 500,
          used_count: 82,
          valid_until: "2027-12-31T23:59:59Z",
          min_order_amount: 20,
          active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "cpn_adeline100",
          code: "ADELINE",
          discount_type: "percent",
          discount_value: 100,
          applicable_to: "all",
          max_uses: 100,
          used_count: 45,
          valid_until: "2027-12-31T23:59:59Z",
          min_order_amount: 0,
          active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "cpn_tessro10",
          code: "TESSRO10",
          discount_type: "percent",
          discount_value: 10,
          applicable_to: "all",
          max_uses: 10000,
          used_count: 310,
          valid_until: "2027-12-31T23:59:59Z",
          min_order_amount: 0,
          active: true,
          created_at: new Date().toISOString(),
        },
      ];
      saveLocalStore(parsed);
    }
    return parsed;
  } catch {
    return { users: [], tickets: [], messages: [], projects: [], logs: [], verificationCodes: [], passkeys: [], coupons: [] };
  }
}

function saveLocalStore(store: DBStore) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), "utf8");
  } catch (err) {
    console.error("[Tessro DB] Error saving local store:", err);
  }
}

export const db = {
  // Check active storage engine
  getEngine: () => (pool ? "PostgreSQL (Connected)" : "Local Persistent JSON DB"),

  // USERS
  users: {
    async findByEmail(email: string): Promise<DBUser | null> {
      const store = ensureLocalStore();
      const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      return user || null;
    },

    async findById(id: string): Promise<DBUser | null> {
      const store = ensureLocalStore();
      const user = store.users.find((u) => u.id === id);
      return user || null;
    },

    async getAll(): Promise<Omit<DBUser, "password_hash">[]> {
      const store = ensureLocalStore();
      return store.users.map(({ password_hash, ...rest }) => rest);
    },

    async create(user: Omit<DBUser, "created_at"> & { id?: string }): Promise<DBUser> {
      const store = ensureLocalStore();
      const newUser: DBUser = {
        ...user,
        id: user.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        email_verified: user.email_verified ?? false,
        created_at: new Date().toISOString(),
      };
      store.users.push(newUser);
      saveLocalStore(store);
      return newUser;
    },

    async update(id: string, updates: Partial<DBUser>): Promise<DBUser | null> {
      const store = ensureLocalStore();
      const idx = store.users.findIndex((u) => u.id === id);
      if (idx === -1) return null;
      store.users[idx] = { ...store.users[idx], ...updates };
      saveLocalStore(store);
      return store.users[idx];
    },

    async updateRole(id: string, role: "client" | "staff" | "admin"): Promise<DBUser | null> {
      return this.update(id, { role });
    },
  },

  // VERIFICATION CODES (Email OTP & Magic Link)
  verification: {
    async createCode(email: string, code: string, expiresInMinutes: number = 10): Promise<DBVerificationCode> {
      const store = ensureLocalStore();
      // Remove any existing codes for this email
      store.verificationCodes = store.verificationCodes.filter(
        (c) => c.email.toLowerCase() !== email.toLowerCase()
      );

      const record: DBVerificationCode = {
        id: `vc_${Date.now()}`,
        email: email.toLowerCase(),
        code,
        expires_at: Date.now() + expiresInMinutes * 60 * 1000,
        created_at: new Date().toISOString(),
      };

      store.verificationCodes.push(record);
      saveLocalStore(store);
      return record;
    },

    async verifyCode(email: string, code: string): Promise<boolean> {
      const store = ensureLocalStore();
      const record = store.verificationCodes.find(
        (c) => c.email.toLowerCase() === email.toLowerCase() && c.code === code.trim()
      );

      if (!record) return false;
      if (Date.now() > record.expires_at) return false;

      // Consume code so it cannot be reused
      store.verificationCodes = store.verificationCodes.filter((c) => c.id !== record.id);
      saveLocalStore(store);

      // Mark user as email_verified
      const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        user.email_verified = true;
        saveLocalStore(store);
      }

      return true;
    },
  },

  // PASSKEYS (WebAuthn / FIDO2)
  passkeys: {
    async create(passkey: DBPasskey): Promise<DBPasskey> {
      const store = ensureLocalStore();
      store.passkeys.push(passkey);
      saveLocalStore(store);
      return passkey;
    },

    async findById(credentialId: string): Promise<DBPasskey | null> {
      const store = ensureLocalStore();
      return store.passkeys.find((p) => p.id === credentialId) || null;
    },

    async findByUserId(userId: string): Promise<DBPasskey[]> {
      const store = ensureLocalStore();
      return store.passkeys.filter((p) => p.user_id === userId);
    },

    async updateCounter(credentialId: string, counter: number): Promise<void> {
      const store = ensureLocalStore();
      const passkey = store.passkeys.find((p) => p.id === credentialId);
      if (passkey) {
        passkey.counter = counter;
        saveLocalStore(store);
      }
    },
  },

  // TICKETS
  tickets: {
    async getAll(filter?: { client_id?: string; status?: string }): Promise<DBTicket[]> {
      const store = ensureLocalStore();
      let results = [...store.tickets];
      if (filter?.client_id) {
        results = results.filter((t) => t.client_id === filter.client_id);
      }
      if (filter?.status && filter.status !== "all") {
        results = results.filter((t) => t.status === filter.status);
      }
      return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },

    async findById(id: string): Promise<DBTicket | null> {
      const store = ensureLocalStore();
      return store.tickets.find((t) => t.id === id) || null;
    },

    async create(ticket: Omit<DBTicket, "id" | "created_at" | "updated_at">): Promise<DBTicket> {
      const store = ensureLocalStore();
      const id = `TSR-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date().toISOString();
      const newTicket: DBTicket = {
        ...ticket,
        id,
        created_at: now,
        updated_at: now,
      };
      store.tickets.unshift(newTicket);
      saveLocalStore(store);
      return newTicket;
    },

    async update(id: string, updates: Partial<DBTicket>): Promise<DBTicket | null> {
      const store = ensureLocalStore();
      const idx = store.tickets.findIndex((t) => t.id === id);
      if (idx === -1) return null;
      store.tickets[idx] = {
        ...store.tickets[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      saveLocalStore(store);
      return store.tickets[idx];
    },

    async delete(id: string): Promise<boolean> {
      const store = ensureLocalStore();
      const initialLen = store.tickets.length;
      store.tickets = store.tickets.filter((t) => t.id !== id);
      if (store.tickets.length !== initialLen) {
        saveLocalStore(store);
        return true;
      }
      return false;
    },
  },

  // MESSAGES
  messages: {
    async getByTicket(ticketId: string): Promise<DBMessage[]> {
      const store = ensureLocalStore();
      return store.messages
        .filter((m) => m.ticket_id === ticketId)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    },

    async create(msg: Omit<DBMessage, "id" | "created_at">): Promise<DBMessage> {
      const store = ensureLocalStore();
      const newMsg: DBMessage = {
        ...msg,
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        created_at: new Date().toISOString(),
      };
      store.messages.push(newMsg);
      saveLocalStore(store);

      const ticket = store.tickets.find((t) => t.id === msg.ticket_id);
      if (ticket) {
        ticket.updated_at = newMsg.created_at;
        saveLocalStore(store);
      }

      return newMsg;
    },
  },

  // ADELINE PROJECTS
  projects: {
    async getAll(userId?: string): Promise<DBAdelineProject[]> {
      const store = ensureLocalStore();
      if (userId) {
        return store.projects.filter((p) => p.user_id === userId);
      }
      return store.projects;
    },

    async findById(id: string): Promise<DBAdelineProject | null> {
      const store = ensureLocalStore();
      return store.projects.find((p) => p.id === id) || null;
    },

    async create(project: Omit<DBAdelineProject, "id" | "created_at">): Promise<DBAdelineProject> {
      const store = ensureLocalStore();
      const newProj: DBAdelineProject = {
        ...project,
        id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        created_at: new Date().toISOString(),
      };
      store.projects.unshift(newProj);
      saveLocalStore(store);
      return newProj;
    },

    async delete(id: string, userId?: string): Promise<boolean> {
      const store = ensureLocalStore();
      const initial = store.projects.length;
      store.projects = store.projects.filter((p) => {
        if (p.id !== id) return true;
        if (userId && p.user_id !== userId) return true;
        return false;
      });
      if (store.projects.length !== initial) {
        saveLocalStore(store);
        return true;
      }
      return false;
    },
  },

  // COUPONS
  coupons: {
    async getAll(): Promise<DBCoupon[]> {
      const store = ensureLocalStore();
      return store.coupons || [];
    },

    async getByCode(code: string): Promise<DBCoupon | null> {
      const store = ensureLocalStore();
      const coupon = (store.coupons || []).find(
        (c) => c.code.toUpperCase() === code.trim().toUpperCase()
      );
      return coupon || null;
    },

    async create(data: Omit<DBCoupon, "id" | "used_count" | "created_at">): Promise<DBCoupon> {
      const store = ensureLocalStore();
      const newCoupon: DBCoupon = {
        id: `cpn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        ...data,
        code: data.code.toUpperCase().trim(),
        used_count: 0,
        created_at: new Date().toISOString(),
      };
      if (!store.coupons) store.coupons = [];
      store.coupons.unshift(newCoupon);
      saveLocalStore(store);
      return newCoupon;
    },

    async update(id: string, updates: Partial<DBCoupon>): Promise<DBCoupon | null> {
      const store = ensureLocalStore();
      const idx = (store.coupons || []).findIndex((c) => c.id === id);
      if (idx === -1) return null;
      store.coupons[idx] = {
        ...store.coupons[idx],
        ...updates,
        ...(updates.code ? { code: updates.code.toUpperCase().trim() } : {}),
      };
      saveLocalStore(store);
      return store.coupons[idx];
    },

    async delete(id: string): Promise<boolean> {
      const store = ensureLocalStore();
      const initial = store.coupons?.length || 0;
      store.coupons = (store.coupons || []).filter((c) => c.id !== id);
      if (store.coupons.length !== initial) {
        saveLocalStore(store);
        return true;
      }
      return false;
    },

    async incrementUsage(code: string): Promise<boolean> {
      const store = ensureLocalStore();
      const idx = (store.coupons || []).findIndex(
        (c) => c.code.toUpperCase() === code.trim().toUpperCase()
      );
      if (idx === -1) return false;
      store.coupons[idx].used_count += 1;
      saveLocalStore(store);
      return true;
    },
  },

  // LOGS & STATS
  logs: {
    async log(action: string, details: string, userId?: string, ip?: string): Promise<void> {
      const store = ensureLocalStore();
      store.logs.unshift({
        id: `log_${Date.now()}`,
        action,
        details,
        user_id: userId,
        ip_address: ip,
        created_at: new Date().toISOString(),
      });
      if (store.logs.length > 500) store.logs = store.logs.slice(0, 500);
      saveLocalStore(store);
    },

    async getRecent(limit = 50): Promise<DBActivityLog[]> {
      const store = ensureLocalStore();
      return store.logs.slice(0, limit);
    },
  },

  async getStats() {
    const store = ensureLocalStore();
    const activeTickets = store.tickets.filter((t) => t.status !== "resolved").length;
    const completedTickets = store.tickets.filter((t) => t.status === "resolved").length;
    const totalUsers = store.users.length;
    const totalProjects = store.projects.length;

    return {
      activeTickets,
      completedTickets,
      totalTickets: store.tickets.length,
      totalUsers,
      totalProjects,
      engine: pool ? "PostgreSQL (Connected)" : "Local Persistent JSON DB",
      storageBucket: process.env.GCS_BUCKET_NAME || "tessro-cdn-assets (Edge local)",
      databaseConnected: !!pool,
    };
  },
};
