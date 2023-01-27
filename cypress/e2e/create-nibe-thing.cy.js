/* This spec will assume the Nibe add-on has been installed during the setup wizard test run */

const { verify } = require("crypto")

describe('Nibe heat pump thing', () => {
  beforeEach(() => {
    cy.login()
  })

  it('creates the simulator thing and links an item succesfully', () => {

    cy.visit('/settings/things/')

    cy.get('.page-current .fab').first().click()

    cy.get('.page-current li').contains('NibeHeatPump').click()
    cy.get('.page-current li').contains('f470-simulator').click()

    cy.get('.page-current .item-inner').first().should('contain', 'Unique ID')
    cy.get('.page-current .item-inner').first().find('input').clear()
    cy.get('.page-current .item-inner').first().find('input').type('f470pumpsim')

    cy.get('.page-current .button-fill').contains('Create Thing').wait(500).click()

    // this sometimes happens, ignore
    cy.on('uncaught:exception', (err, runnable) => {
      expect(err.message).to.include('Cannot read properties of undefined (reading ')
      return false
    })

    // go see the things details
    cy.wait(500).get('.page-current .item-inner').contains('f470pumpsim').click()

    // switch to the Channels tab
    cy.wait(500).get('.thing-details-page .tab-link').next().contains('Channels').click()

    cy.get('.channel-list .channel-item').first().next().contains('sensor#40004')
    cy.get('.channel-list .channel-item').first().next().click().wait(500)
    cy.get('.channel-list .channel-item').first().next().find('.accordion-item-content').find('.media-item').first().contains('Add Link to Item')
    cy.get('.channel-list .channel-item').first().next().find('.accordion-item-content').find('.media-item').first().click()

    // link an item
    cy.get('.page-current .list li').contains('Create a new Item').click()
    cy.get('.page-current .button-fill').contains('Link').wait(500).click().wait(500)

    // go back to the items list and check the link
    cy.visit('/settings/items/')
    cy.wait(500).get('.page-current .list .itemlist-item').contains('BT1 Outdoor Temperature').click()

    // check that the state contains °C
    cy.get('.page-current .after-item-header .card .label-card-content').contains('°C')
  })

  afterEach(() => {
    cy.apiRequest('DELETE', '/rest/links/Simulator_for_Nibe_F470_Heat_Pumps_BT1_Outdoor_Temperature/nibeheatpump:f470-simulator:f470pumpsim:sensor%2340004', null, false)
      .apiRequest('DELETE', '/rest/items/Simulator_for_Nibe_F470_Heat_Pumps_BT1_Outdoor_Temperature', null, false)
      .apiRequest('DELETE', '/rest/things/nibeheatpump:f470-simulator:f470pumpsim', null, false)
  })
})
