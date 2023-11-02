# zod-env

[![version](https://img.shields.io/npm/v/@polioan/zod-env.svg)](https://www.npmjs.com/package/@polioan/zod-env)
[![license](https://img.shields.io/github/license/polioan/zod-env)](https://opensource.org/licenses/MIT)

## Install

### npm

```shell
npm i @polioan/zod-env
```

### yarn

```shell
yarn add @polioan/zod-env
```

## Usage

### Normal

```ts
import { defineEnvSchema } from '@polioan/zod-env'
import { z } from 'zod'

const env = defineEnvSchema({
  schema: z.object({ NODE_ENV: z.enum(['production', 'development']) }),
})

const value = env('NODE_ENV') // "production" | "development"
const unknownValue = env('FOO') // string | undefined
```

### In bundler environment

```ts
import { defineEnvSchema } from '@polioan/zod-env'
import { z } from 'zod'

const env = defineEnvSchema({
  schema: z.object({ NODE_ENV: z.enum(['production', 'development']) }),
  values: {
    NODE_ENV: process.env.NODE_ENV,
  },
})

const value = env('NODE_ENV') // "production" | "development"
const unknownValue = env('FOO') // string | undefined
```

### With Deno or other "non process.env"

```ts
const env = defineEnvSchema({
  schema: z.object({ NODE_ENV: z.enum(['production', 'development']) }),
  envResolver: {
    getFallback() {
      return Deno.env.toObject()
    },
    get(key) {
      return Deno.env.get(key)
    },
  },
})
```
