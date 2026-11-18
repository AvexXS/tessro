"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  UserProfile,
  UserRole,
  StudioTicket,
  ClientProject,
  TicketMessage,
  INITIAL_USER,
  INITIAL_DESIGNER,
  INITIAL_ADMIN,
  INITIAL_PROJECTS,
  INITIAL_TICKETS,
} from "./tessro-store";

interface TessroContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: UserProfile;
  setRole: (role: UserRole) => void;
  setUser: (user: UserProfile) => void;
  login: (email: string, password?: string, role?: UserRole) => Promise<boolean>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  projects: ClientProject[];
  addProject: (project: Omit<ClientProject, "id" | "lastUpdated">) => void;
  tickets: StudioTicket[];
  getTicket: (id: string) => StudioTicket | undefined;
  createTicket: (ticket: Partial<StudioTicket>) => Promise<StudioTicket>;
  updateTicketStatus: (id: string, status: StudioTicket["status"]) => Promise<void>;
  assignDesigner: (ticketId: string, designer: { id: string; name: string; avatar: string; role: string }) => Promise<void>;
  addMessage: (ticketId: string, text: string, attachmentName?: string, attachmentUrl?: string) => Promise<void>;
  refreshTickets: () => Promise<void>;
  refreshProjects: () => Promise<void>;
  storageStats: {
    totalGb: number;
    usedMb: number;
    filesCount: number;
    edgeHitRate: number;
  };
}

const TessroContext = createContext<TessroContextType | undefined>(undefined);

export function TessroProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<UserRole>("client");
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [projects, setProjects] = useState<ClientProject[]>(INITIAL_PROJECTS);
  const [tickets, setTickets] = useState<StudioTicket[]>(INITIAL_TICKETS);
  const [storageStats, setStorageStats] = useState({
    totalGb: 1000,
    usedMb: 264.6,
    filesCount: 142,
    edgeHitRate: 99.8,
  });

  // Fetch verified user session from server API
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          const mappedRole: UserRole =
            data.user.role === "staff" ? "designer" : data.user.role;
          setCurrentRole(mappedRole);
          setCurrentUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: mappedRole,
            avatar: data.user.avatar || INITIAL_USER.avatar,
            company: mappedRole === "client" ? "Acme Neural" : "Tessro Studio HQ",
            plan:
              mappedRole === "client"
                ? "Human Studio ($49.99)"
                : mappedRole === "designer"
                ? "Staff Designer"
                : "Studio Master Admin",
          });
          return true;
        }
      }
    } catch (err) {
      console.warn("Could not check server session:", err);
    }
    return false;
  }, []);

  // Fetch real tickets from backend
  const refreshTickets = useCallback(async () => {
    try {
      const res = await fetch("/api/tickets");
      if (res.ok) {
        const data = await res.json();
        if (data.tickets && Array.isArray(data.tickets)) {
          const mapped: StudioTicket[] = data.tickets.map((t: any) => ({
            id: t.id,
            title: t.title,
            clientName: t.client_name || "Julian Vance",
            clientEmail: t.client_id || "client@acme.ai",
            serviceType: "human_studio",
            price: 49.99,
            status:
              t.status === "in_progress"
                ? "in_design"
                : t.status === "review"
                ? "in_review"
                : t.status === "resolved"
                ? "delivered"
                : "queued",
            priority: t.priority === "urgent" ? "critical" : "standard",
            createdAt: t.created_at,
            deadlineHours: 72,
            revisionRound: 1,
            maxRevisions: "Unlimited",
            archetype: t.category === "Design" ? "Liquid Glass Bento" : "Cyberpunk Neo-Brutalist",
            brief: t.description,
            deliverables: {
              figmaUrl: t.figma_url || "https://figma.com/design/tessro-tokens-v4",
              previewUrl: `/preview/${t.id}`,
              zipDownloadUrl: `/api/export/${t.id}-bundle.zip`,
            },
            assignedDesigner: {
              id: t.assigned_to || "usr_staff_01",
              name: t.assigned_name || "Elena Rostova",
              avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
              role: "Senior Interface Architect",
            },
            messages: [],
          }));

          if (mapped.length > 0) {
            setTickets(mapped);
          }
        }
      }
    } catch (err) {
      console.warn("Could not fetch server tickets:", err);
    }
  }, []);

  // Fetch real projects from backend
  const refreshProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/adeline/projects");
      if (res.ok) {
        const data = await res.json();
        if (data.projects && Array.isArray(data.projects)) {
          const mapped: ClientProject[] = data.projects.map((p: any) => ({
            id: p.id,
            title: p.title,
            domain: `${p.title.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "")}.tessro.cloud`,
            archetype: p.archetype || "Liquid Glass Bento",
            mode: "adeline_ai",
            status: "live",
            lastUpdated: "Active",
            previewUrl: p.preview_url || `/preview/${p.id}`,
            zipExportUrl: `/api/adeline/export`,
            storageMb: 38.4,
          }));

          if (mapped.length > 0) {
            setProjects(mapped);
          }
        }
      }
    } catch (err) {
      console.warn("Could not fetch server projects:", err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      const isAuth = await checkSession();
      if (!isAuth) {
        // Fallback check localStorage for client persistence
        try {
          const savedAuth = localStorage.getItem("tessro_auth");
          const savedUser = localStorage.getItem("tessro_user");
          if (savedAuth === "true" && savedUser) {
            setIsAuthenticated(true);
            setCurrentUser(JSON.parse(savedUser));
          }
        } catch {}
      }
      await refreshTickets();
      await refreshProjects();
      setIsLoading(false);
    }
    init();
  }, [checkSession, refreshTickets, refreshProjects]);

  const login = async (email: string, password = "password123", role: UserRole = "client"): Promise<boolean> => {
    try {
      const serverRole = role === "designer" ? "staff" : role;
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: serverRole }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        const userProfile: UserProfile = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role,
          avatar: data.user.avatar || INITIAL_USER.avatar,
          company: role === "client" ? "Acme Neural" : "Tessro Studio HQ",
          plan: role === "client" ? "Human Studio ($49.99)" : role === "designer" ? "Staff Designer" : "Studio Admin",
        };
        setCurrentUser(userProfile);
        setCurrentRole(role);
        try {
          localStorage.setItem("tessro_auth", "true");
          localStorage.setItem("tessro_role", role);
          localStorage.setItem("tessro_user", JSON.stringify(userProfile));
        } catch {}
        await refreshTickets();
        await refreshProjects();
        return true;
      }
    } catch (err) {
      console.error("Login API error:", err);
    }

    // Local fallback
    const userProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: email ? email.split("@")[0].replace(".", " ") : "Julian Vance",
      email: email || "client@acme.ai",
      role,
      avatar:
        role === "designer"
          ? INITIAL_DESIGNER.avatar
          : role === "admin"
          ? INITIAL_ADMIN.avatar
          : INITIAL_USER.avatar,
      company: role === "client" ? "Acme Neural" : "Tessro Studio HQ",
      plan: role === "client" ? "Human Studio ($49.99)" : role === "designer" ? "Staff Designer" : "Studio Admin",
    };
    setIsAuthenticated(true);
    setCurrentUser(userProfile);
    setCurrentRole(role);
    try {
      localStorage.setItem("tessro_auth", "true");
      localStorage.setItem("tessro_role", role);
      localStorage.setItem("tessro_user", JSON.stringify(userProfile));
    } catch {}
    return true;
  };

  const register = async (email: string, password: string, name: string, role: UserRole = "client"): Promise<boolean> => {
    try {
      const serverRole = role === "designer" ? "staff" : role;
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role: serverRole }),
      });

      if (res.ok) {
        return await login(email, password, role);
      }
    } catch (err) {
      console.error("Register API error:", err);
    }
    return login(email, password, role);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setIsAuthenticated(false);
    try {
      localStorage.removeItem("tessro_auth");
      localStorage.removeItem("tessro_user");
    } catch {}
  };

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    try {
      localStorage.setItem("tessro_role", role);
    } catch {}

    let userToSet = INITIAL_USER;
    if (role === "designer") {
      userToSet = INITIAL_DESIGNER;
    } else if (role === "admin") {
      userToSet = INITIAL_ADMIN;
    }
    setCurrentUser(userToSet);
    try {
      localStorage.setItem("tessro_user", JSON.stringify(userToSet));
    } catch {}
  };

  const addProject = (projectData: Omit<ClientProject, "id" | "lastUpdated">) => {
    const newProject: ClientProject = {
      ...projectData,
      id: `proj_${Date.now()}`,
      lastUpdated: "Just now",
    };
    const updated = [newProject, ...projects];
    setProjects(updated);
  };

  const getTicket = (id: string) => {
    return tickets.find((t) => t.id === id);
  };

  const createTicket = async (ticketData: Partial<StudioTicket>): Promise<StudioTicket> => {
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: ticketData.title || "Custom Studio Brief",
          description: ticketData.brief || "Client brief description",
          category: ticketData.archetype ? "Design" : "Development",
          priority: ticketData.priority === "critical" ? "urgent" : "medium",
          figma_url: ticketData.deliverables?.figmaUrl,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const created: StudioTicket = {
          id: data.ticket.id,
          title: data.ticket.title,
          clientName: currentUser.name,
          clientEmail: currentUser.email,
          serviceType: "human_studio",
          price: 49.99,
          status: "queued",
          priority: ticketData.priority || "standard",
          createdAt: data.ticket.created_at,
          deadlineHours: 72,
          revisionRound: 1,
          maxRevisions: "Unlimited",
          archetype: ticketData.archetype || "Liquid Glass Bento",
          brief: data.ticket.description,
          assignedDesigner: {
            id: "usr_staff_01",
            name: "Elena Rostova",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            role: "Senior Interface Architect",
          },
          deliverables: {
            figmaUrl: "https://figma.com/design/tessro-tokens-v4",
            previewUrl: `/preview/${data.ticket.id}`,
            zipDownloadUrl: `/api/export/${data.ticket.id}-bundle.zip`,
          },
          messages: [
            {
              id: `msg_${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              senderRole: currentUser.role,
              avatar: currentUser.avatar,
              text: data.ticket.description,
              timestamp: "Just now",
            },
          ],
        };

        setTickets((prev) => [created, ...prev]);
        return created;
      }
    } catch (err) {
      console.warn("Failed to save ticket to server API, using local:", err);
    }

    const localId = `TSR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: StudioTicket = {
      id: localId,
      title: ticketData.title || "Custom Studio Design Brief",
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      serviceType: ticketData.serviceType || "human_studio",
      price: 49.99,
      status: "queued",
      priority: ticketData.priority || "standard",
      createdAt: new Date().toISOString(),
      deadlineHours: 72,
      revisionRound: 1,
      maxRevisions: "Unlimited",
      archetype: ticketData.archetype || "Liquid Glass Bento",
      brief: ticketData.brief || "Custom client request brief details.",
      assignedDesigner: {
        id: "usr_designer_01",
        name: "Elena Rostova",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "Senior Interface Architect",
      },
      messages: [],
      ...ticketData,
    };
    setTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const updateTicketStatus = async (id: string, status: StudioTicket["status"]) => {
    try {
      const serverStatus =
        status === "in_design"
          ? "in_progress"
          : status === "in_review"
          ? "review"
          : status === "delivered"
          ? "resolved"
          : "open";

      await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: serverStatus }),
      });
    } catch {}

    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const assignDesigner = async (
    ticketId: string,
    designer: { id: string; name: string; avatar: string; role: string }
  ) => {
    try {
      await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assigned_to: designer.id, assigned_name: designer.name }),
      });
    } catch {}

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, assignedDesigner: designer, status: "in_design" as const }
          : t
      )
    );
  };

  const addMessage = async (
    ticketId: string,
    text: string,
    attachmentName?: string,
    attachmentUrl?: string
  ) => {
    try {
      await fetch(`/api/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          attachment_url: attachmentUrl,
        }),
      });
    } catch {}

    const newMsg: TicketMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      avatar: currentUser.avatar,
      text,
      timestamp: "Just now",
      attachmentName,
      attachmentUrl,
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, messages: [...t.messages, newMsg] } : t
      )
    );
  };

  return (
    <TessroContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        currentUser,
        setRole,
        setUser: setCurrentUser,
        login,
        register,
        logout,
        projects,
        addProject,
        tickets,
        getTicket,
        createTicket,
        updateTicketStatus,
        assignDesigner,
        addMessage,
        refreshTickets,
        refreshProjects,
        storageStats,
      }}
    >
      {children}
    </TessroContext.Provider>
  );
}

export function useTessro() {
  const ctx = useContext(TessroContext);
  if (!ctx) {
    throw new Error("useTessro must be used within a TessroProvider");
  }
  return ctx;
}
