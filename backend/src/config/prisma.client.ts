import { PrismaClient } from '@prisma/client';

/**
 * @constant {PrismaClient} prisma - An instance of Prisma Client used for database interactions.
 * @see https://www.prisma.io/docs/concepts/components/prisma-client
 */

export const prisma = new PrismaClient();