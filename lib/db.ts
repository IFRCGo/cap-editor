import { PrismaClient } from ".prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const client: PrismaClient = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;
