import { keys as email } from '@repo/email/keys';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
  extends: [email()],
  server: {},
  client: {},
  runtimeEnv: {},
});
