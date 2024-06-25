export interface Stamp {
  standistId: string;
  timestamp: number;
  scanTimestamp: number;
  signature: string;
}

export interface StampWithId extends Stamp {
  id: number;
}

export const stampIndexes = '++id, &standistId, timestamp';
