/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type PrismaInstance = InstanceType<typeof PrismaClient>;

const globalForPrisma = globalThis as unknown as { __prisma: PrismaInstance | undefined };

function getPrismaClient(): PrismaInstance {
  if (!globalForPrisma.__prisma) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
    const client = new (PrismaClient as any)({ adapter });
    globalForPrisma.__prisma = client as PrismaInstance;
  }
  return globalForPrisma.__prisma!;
}

export const prisma = new Proxy({} as PrismaInstance, {
  get(_target, prop) {
    return (getPrismaClient() as any)[prop];
  },
});
