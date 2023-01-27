/// <reference types="cypress" />

/* This spec will run through the initial account creation */

const USERNAME = 'openhab'
const PASSWORD = 'habopen'

describe('setup-wizard', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
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
    cy.get('.smart-select-page').find('input[value="de"]').parents('label').click({ force: true })
    // the item should now contain Sprache
    cy.get('.setup-wizard #intro .item-link').first().contains('Sprache')

    // select the French option
    cy.get('.setup-wizard #intro .item-link').first().click()
    // the popup should be opened
    cy.get('.smart-select-page .navbar').contains('Sprache')
    cy.get('.smart-select-page').find('input[value="fr"]').parents('label').click({ force: true })
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
})
