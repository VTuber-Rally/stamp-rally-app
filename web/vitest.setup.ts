import { vi } from "vitest";

import "@/lib/i18n.ts";

vi.mock("appwrite", () => {
  const Client = vi.fn();
  Client.prototype.setEndpoint = vi.fn().mockReturnThis();
  Client.prototype.setProject = vi.fn().mockReturnThis();

  const Account = vi.fn();
  Account.prototype.get = vi.fn();
  Account.prototype.createEmailPasswordSession = vi.fn();
  Account.prototype.createAnonymousSession = vi.fn();

  const Databases = vi.fn();
  Databases.prototype.listDocuments = vi.fn();
  Databases.prototype.createDocument = vi.fn();
  Databases.prototype.updateDocument = vi.fn();

  const Functions = vi.fn();
  Functions.prototype.createExecution = vi.fn();

  const Storage = vi.fn();
  Storage.prototype.getFileDownload = vi.fn();
  Storage.prototype.listFiles = vi.fn();

  return { Client, Account, Functions, Databases, Storage };
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

process.env.TZ = "UTC";
