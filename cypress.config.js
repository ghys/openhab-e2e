const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "quu4in",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
