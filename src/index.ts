import type { z } from 'zod'

export type EnvRecord = Record<string, string | undefined>

export interface IEnvResolver {
  getFallback?: (() => EnvRecord) | undefined
  get?: ((key: string) => string | undefined) | undefined
}

export class NodeEnvResolver implements IEnvResolver {
  public getFallback() {
    return process.env
  }

  public get(key: string) {
    return process.env[key]
  }
}

export function defineEnvSchema<T extends z.AnyZodObject>({
  schema,
  values,
  envResolver = new NodeEnvResolver(),
}: {
  schema: T
  values?: EnvRecord | undefined
  envResolver?: IEnvResolver | undefined
}) {
  function getAllEnv() {
    if (typeof values !== 'undefined') {
      return values
    }
    if (envResolver.getFallback) {
      return envResolver.getFallback()
    }
    return {}
  }

  const parsed = schema.parse(getAllEnv())

  type Parsed = z.infer<typeof schema>

  type ParsedKeys = keyof Parsed

  return function <T extends ParsedKeys | (string & {})>(
    key: T
  ): T extends ParsedKeys ? Parsed[T] : string | undefined {
    const result = parsed[key]
    if (typeof result === 'undefined') {
      if (envResolver.get) {
        // @ts-expect-error
        return envResolver.get(key)
      }
    }
    return result
  }
}
