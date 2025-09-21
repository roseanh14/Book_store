import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      cwd: process.cwd(),
      stdout: 'ignore',
      stderr: 'ignore',
    },
  ],
});