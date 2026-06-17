import { defineConfig } from 'orval'

export default defineConfig({
  inventory: {
    input: './openapi/spec.yaml',
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      schemas: './src/api/generated/schemas',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/api/mutator.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
