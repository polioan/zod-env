import { describe, test, expect } from 'vitest'
import { defineEnvSchema } from '../src/index'
import { z, ZodError } from 'zod'

describe('defineEnvSchema and env fn', () => {
  test('Parse error', () => {
    expect(() => {
      defineEnvSchema({
        schema: z.object({
          NODE_ENV: z.enum(['production', 'development']),
        }),
      })
    }).toThrowError(ZodError)

    expect(() => {
      defineEnvSchema({
        schema: z.object({
          NODE_ENV: z.enum(['production', 'development']),
        }),
        values: {},
      })
    }).toThrowError(ZodError)
  })

  test('Successful', () => {
    {
      process.env.NODE_ENV = 'development'

      const env = defineEnvSchema({
        schema: z.object({ NODE_ENV: z.enum(['production', 'development']) }),
      })
      expect(env('NODE_ENV')).toStrictEqual('development')
      expect(env('NODE_ENV2')).toStrictEqual(undefined)

      delete process.env.NODE_ENV
    }
    {
      const env = defineEnvSchema({
        schema: z.object({}),
      })
      expect(env('NODE_ENV')).toStrictEqual(undefined)
    }
  })

  test('Custom env resolver', () => {
    const env = defineEnvSchema({
      schema: z.object({}),
      envResolver: {},
    })
    expect(env('NODE_ENV')).toStrictEqual(undefined)
  })
})
