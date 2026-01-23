import { defineConfig } from "cypress";

const baseUrl = process.env.CYPRESS_BASE_URL || "http://localhost:4200";

export default defineConfig({
  e2e: {
    baseUrl,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
