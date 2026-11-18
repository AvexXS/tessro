"use client";

export type UserRole = "client" | "designer" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  company?: string;
  plan: string;
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  avatar: string;
  text: string;
  timestamp: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface TicketDeliverable {
  figmaUrl?: string;
  previewUrl?: string;
  zipDownloadUrl?: string;
  deliveredAt?: string;
}

export interface StudioTicket {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  serviceType: "human_studio" | "adeline_builder" | "micro_logo" | "micro_video";
  price: number;
  status: "queued" | "in_design" | "in_review" | "delivered";
  priority: "standard" | "rush" | "critical";
  assignedDesigner?: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  createdAt: string;
  deadlineHours: number;
  revisionRound: number;
  maxRevisions: string; // "Unlimited" for Human Studio
  archetype: string;
  brief: string;
  deliverables?: TicketDeliverable;
  messages: TicketMessage[];
}

export interface ClientProject {
  id: string;
  title: string;
  domain: string;
  archetype: string;
  mode: "human_craft" | "adeline_ai";
  status: "live" | "building" | "review";
  previewUrl: string;
  zipExportUrl: string;
  storageMb: number;
  lastUpdated: string;
}

// Initial Authentic Seed Data (Clean state for real users)
export const INITIAL_USER: UserProfile = {
  id: "",
  name: "Studio Owner",
  email: "",
  role: "admin",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  company: "Tessro Studio HQ",
  plan: "Founder & CEO / CTO",
};

export const INITIAL_DESIGNER: UserProfile = {
  id: "usr_designer_01",
  name: "Marcus Thorne",
  email: "marcus.thorne@tessro.com",
  role: "designer",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  company: "Tessro Senior Studio",
  plan: "Staff Designer",
};

export const INITIAL_ADMIN: UserProfile = {
  id: "usr_admin_01",
  name: "Elena Rostova",
  email: "elena@tessro.com",
  role: "admin",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  company: "Tessro Studio HQ",
  plan: "Owner / Studio Lead",
};

export const INITIAL_PROJECTS: ClientProject[] = [];

export const INITIAL_TICKETS: StudioTicket[] = [];
        id: "msg_02",
        senderId: "usr_designer_01",
        senderName: "Marcus Thorne",
        senderRole: "designer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        text: "Welcome Alexander! Brief reviewed. I've initiated the Figma tokens and calibrated the Liquid Glass Bento archetype with sub-pixel refractive borders. First interactive staging preview is attached below.",
        timestamp: "Today at 02:20 PM",
        attachmentName: "nexus-v1-tokens.fig",
        attachmentUrl: "https://storage.googleapis.com/tessro-cdn-1tb/nexus-v1-tokens.fig",
      },
      {
        id: "msg_03",
        senderId: "usr_client_01",
        senderName: "Alexander Vance",
        senderRole: "client",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        text: "The glass cards look stunning. Could we tweak the cyan glow on the CTA button to be slightly deeper electric blue? Otherwise this is ready for export.",
        timestamp: "Today at 03:45 PM",
      },
    ],
  },
  {
    id: "TSR-8093",
    title: "Solana Autonomous Vault Adeline Synthesis",
    clientName: "Sophia Lin",
    clientEmail: "sophia@solanavault.xyz",
    serviceType: "adeline_builder",
    price: 29.99,
    status: "delivered",
    priority: "standard",
    assignedDesigner: {
      id: "usr_adeline",
      name: "Adeline Neural Core",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      role: "Autonomous Synthesis Engine",
    },
    createdAt: "2026-11-14T11:00:00Z",
    deadlineHours: 1,
    revisionRound: 0,
    maxRevisions: "Instant Regenerate",
    archetype: "Neo-Brutalism & Glow",
    brief: "Generate a responsive 5-section decentralized finance vault landing page with 3D token cards and instant React code export.",
    deliverables: {
      previewUrl: "https://solana-vault.tessro.cloud",
      zipDownloadUrl: "/api/export/solana-vault.zip",
      deliveredAt: "2026-11-14T11:14:00Z",
    },
    messages: [
      {
        id: "msg_201",
        senderId: "usr_adeline",
        senderName: "Adeline Neural Core",
        senderRole: "admin",
        avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
        text: "Synthesis completed in 14m 28s. All React 19 components, Tailwind CSS styling, and 1TB Google Cloud Storage assets are packaged and verified.",
        timestamp: "Nov 14 at 11:15 AM",
        attachmentName: "solana-vault-production.zip",
        attachmentUrl: "https://storage.googleapis.com/tessro-cdn-1tb/solana-vault-production.zip",
      },
    ],
  },
  {
    id: "TSR-8094",
    title: "Aura Minimalist Rebranding & 4K Video Loop",
    clientName: "David Sterling",
    clientEmail: "david@aurastudio.de",
    serviceType: "micro_video",
    price: 5.00,
    status: "in_design",
    priority: "standard",
    assignedDesigner: {
      id: "usr_designer_02",
      name: "Chloe Chen",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      role: "Motion Graphics Designer",
    },
    createdAt: "2026-11-16T12:00:00Z",
    deadlineHours: 24,
    revisionRound: 1,
    maxRevisions: "Unlimited",
    archetype: "Swiss Minimalist Rigor",
    brief: "Sub-5MB seamless looping 16:9 ambient motion hero video backdrop for Swiss watch exhibition.",
    messages: [
      {
        id: "msg_301",
        senderId: "usr_designer_02",
        senderName: "Chloe Chen",
        senderRole: "designer",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        text: "Working on the 60fps WebM/MP4 render with monochrome lighting now. Will upload to GCS edge CDN within 3 hours.",
        timestamp: "Today at 01:10 PM",
      },
    ],
  },
];
