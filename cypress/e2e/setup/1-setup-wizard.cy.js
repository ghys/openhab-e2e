/// <reference types="cypress" />

/* This spec will run through the setup wizard, installing 4 add-ons */
/* It should not be run again once it has successfully completed */
/* Further specs depend on it having completed */

const USERNAME = 'openhab'
const PASSWORD = 'habopen'

describe('setup wizard', { browser: 'chrome' }, () => {
  beforeEach(() => {
    cy.visit('/')
    cy.contains('Sign in to grant')
    cy.get('input[name="username"]').focus().type(USERNAME)
    cy.get('input[name="password"]').first().focus().type(PASSWORD)
    cy.get('form').submit()
    cy.get('.setup-wizard #intro .login-screen-title').should('exist')
  })

  it('should display 3 regional settings list items', () => {
    cy.get('.setup-wizard #intro .item-link').should('have.length', 3)
  })

  it('open a popup and switch the language immediately when a language is clicked', () => {
    cy.get('.setup-wizard #intro .item-link').first().click()
    // the popup should be opened
    cy.get('.smart-select-page .navbar').contains('Language')

    // select the German option
    cy.wait(500).get('.smart-select-page').find('input[value="de"]').parents('label').click({ force: true })
    // the item should now contain Sprache
    cy.wait(500).get('.setup-wizard #intro .item-link').first().contains('Sprache')

    // select the French option
    cy.get('.setup-wizard #intro .item-link').first().click()
    // the popup should be opened
    cy.get('.smart-select-page .navbar').contains('Sprache')
    cy.wait(500).get('.smart-select-page').find('input[value="fr"]').parents('label').click({ force: true })
    // the item should now contain Langue
    cy.get('.setup-wizard #intro .item-link').first().contains('Langue')
  })

  it('navigates to other pages (set your location, install add-ons) and back', () => {
    cy.get('.setup-wizard #intro .button').first().contains('Begin Setup').click()
    // has navigated to the second step
    cy.wait(500).get('.setup-wizard #location').should('have.class', 'tab-active')
    // find the last button ('Configure in Settings later') and click on it
    cy.get('.setup-wizard #location .button').last().contains('Configure in Settings Later').click()
    // has navigated to the third step
    cy.wait(500).get('.setup-wizard #addons').should('have.class', 'tab-active')
    // find the back link and click on it
    cy.get('.setup-wizard #addons a').first().contains('arrow_left').click()
    // we're back to the second step
    cy.wait(500).get('.setup-wizard #location').should('have.class', 'tab-active')
    // find the back link and click on it
    cy.get('.setup-wizard #location a').first().contains('arrow_left').click()
    // we're back to the first step
    cy.wait(500).get('.setup-wizard #intro').should('have.class', 'tab-active')
  })

  it('installs the add-ons and finally displays the "Welcome to openHAB" screen', () => {
    cy.get('.setup-wizard #intro .button').first().contains('Begin Setup').click()
    // has navigated to the second step
    cy.wait(500).get('.setup-wizard #location').should('have.class', 'tab-active')
    // find the last button ('Configure in Settings later') and click on it
    cy.get('.setup-wizard #location .button').last().contains('Configure in Settings Later').click()
    // has navigated to the third step
    cy.wait(500).get('.setup-wizard #addons').should('have.class', 'tab-active')

    // find and click on the button to install add-ons
    cy.get('.setup-wizard #addons .button-large').contains('Select Add-ons to Install').click()

    // verify the popup is displayed
    cy.wait(500).get('.autocomplete-popup').find('.navbar .title').contains('Select Add-ons to Install')

    // select 4 add-ons to install
    cy.get('.autocomplete-popup input[type=search]').clear().type('astro')
    cy.get('.autocomplete-popup li label').contains('Astro Binding').click()
    cy.get('.autocomplete-popup input[type=search]').clear().type('http')
    cy.get('.autocomplete-popup li label').contains('HTTP Binding').click()
    cy.get('.autocomplete-popup input[type=search]').clear().type('JavaScript Scripting')
    cy.get('.autocomplete-popup li label').contains('JavaScript Scripting').click()
    cy.get('.autocomplete-popup input[type=search]').clear().type('nibe heat pump')
    cy.get('.autocomplete-popup li label').contains('Nibe Heat Pump').click()

    cy.go("back")

    cy.wait(500).get('.setup-wizard #addons .list').find('li').should('have.length', 5)

    cy.get('.setup-wizard #addons').find('.button-fill').last().contains('Install 4 add-ons').click()

    // wait up to 120s for the add-ons to be installed - the "finish" step should be the active one
    cy.get('.setup-wizard .tab-active').contains('Welcome to openHAB!', { timeout: 120000 })

    cy.get('.setup-wizard .tab-active .button').contains('Get Started').click().wait(1000)

    // the home page should now be displayed
    cy.wait(1000).get('.home-nav').contains('Overview')
  })

})
