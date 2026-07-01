import { PrismaClient } from "@prisma/client";

// Singleton, чтобы в dev-режиме hot-reload не плодил подключения.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Плейсхолдер-URL, чтобы клиент конструировался даже без DATABASE_URL
// (тогда запросы просто падают и перехватываются — сайт открывается без БД).
const dbUrl =
  process.env.DATABASE_URL ||
  "postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder?schema=public";

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: dbUrl,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
