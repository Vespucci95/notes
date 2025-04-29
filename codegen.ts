import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://localhost:8000/___graphql',
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/__generated__/gatsby-types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
      ],
    },
  },
  overwrite: true,
}

export default config
