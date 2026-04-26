/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface ImportMetaEnv {
  VITE_APPWRITE_ENDPOINT: string;
  VITE_APPWRITE_PROJECT_ID: string;
  readonly VITE_APPWRITE_NOTIFICATION_PROVIDER_ID: string;
  VITE_COMMIT_REF: string;
  VITE_BUILD_ID: string;
  VITE_DATABASE_ID: string;
  VITE_STANDISTS_COLLECTION_ID: string;
  VITE_SUBMIT_FUNCTION_ID: string;
  VITE_SUBMISSIONS_COLLECTION_ID: string;
  VITE_PRIZES_COLLECTION_ID: string;
  VITE_CONTEST_PARTICIPANTS_COLLECTION_ID: string;
  VITE_REGISTER_CONTEST_PARTICIPANT_FUNCTION_ID: string;
  VITE_GET_PRIVATE_KEY_FUNCTION_ID: string;
  VITE_SEND_NOTIFICATION_FUNCTION_ID: string;
  VITE_KV_COLLECTION_ID: string;
  VITE_ASSETS_BUCKET_ID: string;
  readonly VITE_MAP_TILES_URL: string;
  readonly VITE_GET_AVAILABLE_CARDS_FUNCTION_ID: string;
  readonly VITE_SELL_CARDS_FUNCTION_ID: string;
  readonly VITE_CARDS_COLLECTION_ID: string;
  readonly VITE_GROUPS_COLLECTION_ID: string;
  readonly VITE_CARD_DESIGNS_COLLECTION_ID: string;

  readonly VITE_STANDARD_REWARD_MIN_STAMPS_REQUIREMENT: string;
  readonly VITE_PREMIUM_REWARD_MIN_STAMPS_REQUIREMENT: string;
  VITE_EVENT_END_DATE: string;

  readonly VITE_INDEXEDDB_NAME: string;

  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_VAPID_PUBLIC_KEY: string;
  readonly VITE_RALLY_FINISHERS_EN_TOPIC_ID: string;
  readonly VITE_RALLY_FINISHERS_FR_TOPIC_ID: string;

  readonly VITE_SENTRY_DSN: string;
  readonly VITE_SENTRY_ENVIRONMENT: string;

  readonly VITE_CONVEX_URL: string;
  readonly VITE_CONVEX_SITE_URL: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_IS_MINOR_HALL_REQUIRED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  plausible: {
    (
      eventName: string,
      arguments?: {
        callback?: () => unknown;
        props?: Record<string, string>;
      },
    ): void;
    q?: unknown[];
  };
}

// From https://raw.githubusercontent.com/microsoft/TypeScript/refs/heads/main/src/lib/esnext.typedarrays.d.ts
// Can be removed after upgrading TypeScript (with the rest of the toolchain)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
  /**
   * Converts the `Uint8Array` to a base64-encoded string.
   * @param options If provided, sets the alphabet and padding behavior used.
   * @returns A base64-encoded string.
   */
  toBase64(options?: {
    alphabet?: "base64" | "base64url" | undefined;
    omitPadding?: boolean | undefined;
  }): string;

  /**
   * Sets the `Uint8Array` from a base64-encoded string.
   * @param string The base64-encoded string.
   * @param options If provided, specifies the alphabet and handling of the last chunk.
   * @returns An object containing the number of bytes read and written.
   * @throws {SyntaxError} If the input string contains characters outside the specified alphabet, or if the last
   * chunk is inconsistent with the `lastChunkHandling` option.
   */
  setFromBase64(
    string: string,
    options?: {
      alphabet?: "base64" | "base64url" | undefined;
      lastChunkHandling?:
        | "loose"
        | "strict"
        | "stop-before-partial"
        | undefined;
    },
  ): {
    read: number;
    written: number;
  };

  /**
   * Converts the `Uint8Array` to a base16-encoded string.
   * @returns A base16-encoded string.
   */
  toHex(): string;

  /**
   * Sets the `Uint8Array` from a base16-encoded string.
   * @param string The base16-encoded string.
   * @returns An object containing the number of bytes read and written.
   */
  setFromHex(string: string): {
    read: number;
    written: number;
  };
}

interface Uint8ArrayConstructor {
  /**
   * Creates a new `Uint8Array` from a base64-encoded string.
   * @param string The base64-encoded string.
   * @param options If provided, specifies the alphabet and handling of the last chunk.
   * @returns A new `Uint8Array` instance.
   * @throws {SyntaxError} If the input string contains characters outside the specified alphabet, or if the last
   * chunk is inconsistent with the `lastChunkHandling` option.
   */
  fromBase64(
    string: string,
    options?: {
      alphabet?: "base64" | "base64url" | undefined;
      lastChunkHandling?:
        | "loose"
        | "strict"
        | "stop-before-partial"
        | undefined;
    },
  ): Uint8Array<ArrayBuffer>;

  /**
   * Creates a new `Uint8Array` from a base16-encoded string.
   * @returns A new `Uint8Array` instance.
   */
  fromHex(string: string): Uint8Array<ArrayBuffer>;
}

declare const BUILD_TIMESTAMP: string;
