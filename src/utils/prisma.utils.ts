import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient();
}

prisma = globalThis.prisma;

export default prisma;
