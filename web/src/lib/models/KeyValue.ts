import { Models } from "appwrite";

export interface KeyValue extends Models.Document {
  key: string;
  value: string;
}

export type KeyValueEntry<T> = {
  key: string;
  transform: (value: string) => T;
};
