import { config } from 'dotenv'
import { vi } from 'vitest'

// Load environment variables for tests
config({ path: '.env.test' })

// Set default JWT secret for tests
process.env.JWT_SECRET = 'test-jwt-secret-key'

// Mock Prisma for tests
vi.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    todo: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    project: {
      findFirst: vi.fn(),
    },
  },
})) 