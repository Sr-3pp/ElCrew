import { createAuthClient } from 'better-auth/vue'
import { customSessionClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  plugins: [
    customSessionClient(),
  ],
})
