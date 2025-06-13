import type { Payload } from "./payload";

export type UserContext = Pick<Payload, "sub" | "role" | "isDoctor">;
