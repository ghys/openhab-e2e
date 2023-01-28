/// <reference types="cypress" />

/* This spec will run through the initial account creation */
/* It should not be run again once it has successfully completed */
/* Further specs depend on it having completed */

const USERNAME = 'openhab'
const PASSWORD = 'habopen'

describe('first-time account creation', { browser: 'chrome' }, () => {
  beforeEach(() => {
    cy.visit('/')
    cy.contains('Create a first administrator account to continue')
  })

  it('detects non-matching passwords', () => {
    cy.get('input[name="username"]').focus().type(USERNAME)
    cy.get('input[name="password"]').first().focus().type(PASSWORD)
    cy.get('input[name="password_repeat"]').first().focus().type(PASSWORD + 'wrong')
    cy.get('form').submit()
    cy.contains('Passwords don\'t match')
  })

  it('creates the first account successfully', () => {
    cy.get('input[name="username"]').focus().type(USERNAME)
    cy.get('input[name="password"]').first().focus().type(PASSWORD)
    cy.get('input[name="password_repeat"]').first().focus().type(PASSWORD)
    cy.get('form').submit()
  })

})
