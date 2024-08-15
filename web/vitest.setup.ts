import { vi } from "vitest";

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

  return { Client, Account, Functions, Databases };
});
