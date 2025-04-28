export type Context<T> = {
  req: {
    body: string;
    bodyRaw: string;
    headers: Record<string, string>;
    scheme: string;
    method: string;
    url: string;
    host: string;
    port: string;
    path: string;
    queryString: string;
    query: Record<string, string>;
  };
  res: {
    send: (body: string, code?: number, headers?: any[]) => void;
    json: (body: T) => void;
    empty: () => void;
    redirect: (url: string, code: number) => void;
  };
  log: (message: any) => void;
  error: (message: any) => void;
};
