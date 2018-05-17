'use strict'

require('../../__support__/setup')

const utils = require('../utils')

const peerIp = '167.114.29.55'
const peerPort = '4002'

describe('API 1.0 - Peers', () => {
  describe('GET /peers/version', () => {
    it('should be ok', async () => {
      const response = await utils.request('GET', 'peers/version')
      utils.expectSuccessful(response)

      expect(response.body.version).toBeString()
    })
  })

  describe('GET /peers', () => {
    it('should fail using empty parameters', async () => {
      const response = await utils.request('GET', 'peers', {
        state: null,
        os: null,
        shared: null,
        version: null,
        limit: null,
        offset: null,
        orderBy: null
      })
      utils.expectError(response)

      expect(response.body.error).toContain('should be string')
    })

    it('should fail using limit > 100', async () => {
      const response = await utils.request('GET', 'peers', { limit: 101 })
      utils.expectError(response)

      expect(response.body.error)
    })

    it('should fail using invalid parameters', async () => {
      const response = await utils.request('GET', 'peers', {
        state: 'invalid',
        os: 'invalid',
        shared: 'invalid',
        version: 'invalid',
        limit: 'invalid',
        offset: 'invalid',
        orderBy: 'invalid'
      })
      utils.expectError(response)

      expect(response.body.error).not.toBeNull()
    })
  })

  describe('GET /peers/get', () => {
    it('should fail using known ip address with no port', async () => {
      const response = await utils.request('GET', 'peers/get?ip=127.0.0.1')
      utils.expectError(response)

      expect(response.body.error).toBe('should have required property \'port\'')
    })

    it('should fail using valid port with no ip address', async () => {
      const response = await utils.request('GET', 'peers/get', { port: 4002 })
      utils.expectError(response)

      expect(response.body.error).toBe('should have required property \'ip\'')
    })

    it.skip('should be ok using known ip address and port', async () => {
      const response = await utils.request('GET', 'peers/get', { ip: peerIp, port: peerPort })
      utils.expectSuccessful(response)

      expect(response.body.peer).toBeObject()
    })

    it('should fail using unknown ip address and port', async () => {
      const response = await utils.request('GET', 'peers/get', { ip: '99.99.99.99', port: peerPort })
      utils.expectError(response)

      expect(response.body.error).toBe(`Peer 99.99.99.99:${peerPort} not found`)
    })
  })
})