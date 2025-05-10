import { vi } from "vitest";

import "@/lib/i18n.ts";

vi.mock(import("appwrite"), async (importOriginal) => {
  const original = await importOriginal();

  original.Client.prototype.setEndpoint = vi.fn().mockReturnThis();
  original.Client.prototype.setProject = vi.fn().mockReturnThis();

  original.Account.prototype.get = vi.fn();
  original.Account.prototype.createEmailPasswordSession = vi.fn();
  original.Account.prototype.createAnonymousSession = vi.fn();

  original.Databases.prototype.listDocuments = vi.fn();
  original.Databases.prototype.createDocument = vi.fn();
  original.Databases.prototype.updateDocument = vi.fn();

  original.Functions.prototype.createExecution = vi.fn();

  original.Storage.prototype.getFileDownload = vi.fn();
  original.Storage.prototype.listFiles = vi.fn();

  return original;
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
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
