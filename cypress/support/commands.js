// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password) => {
  const USERNAME = username || 'openhab'
  const PASSWORD = password || 'habopen'
  
  cy.visit('/', {
    onBeforeLoad (win) {
      // set the parameters to disable the transition animations
      win.localStorage.setItem('openhab.ui:theme.pagetransition', 'disabled')
      win.localStorage.setItem('openhab.ui:theme.home.cardanimation', 'disabled')
    }
  })

  // the home page should be displayed
  cy.wait(1000).get('.home-nav').contains('Overview')

  // login if necessary
  if (cy.get('.sidebar.panel-left .button-large')) {
    cy.get('.sidebar.panel-left .button-large').contains('lock_shield_fill').click({ force: true })
    cy.get('input[name="username"]').focus().type(USERNAME)
    cy.get('input[name="password"]').first().focus().type(PASSWORD)
    cy.get('form').submit()

    // wait for the home page to be displayed again
    cy.wait(1000).get('.home-nav').contains('Overview')
  }
})

Cypress.Commands.add('apiRequest', (method, url, body, failOnStatusCode = true) => {
  return cy.getAllLocalStorage().then((ls) => {
    const baseUrl = Cypress.config('baseUrl')
    const refreshToken = ls[baseUrl]['openhab.ui:refreshToken']
    return cy.request('POST', '/rest/auth/token', `grant_type=refresh_token&client_id=${baseUrl}&redirect_uri=${baseUrl}&refresh_token=${refreshToken}`)
      .then((resp) => {
        const accessToken = resp.body.access_token
        return cy.request({
          method: method,
          url: url,
          body: body,
          auth: {
            'bearer': accessToken
          },
          failOnStatusCode: failOnStatusCode
        })
    })
  })
})
