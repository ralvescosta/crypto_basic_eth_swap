/* eslint-disable no-undef */
const { assert } = require('chai');

const Token = artifacts.require("Token");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Token', (accounts) => {
  describe('Token deployment', () => {
    it('should contract has a name', async () => {
      const token = await Token.new();

      const name = await token.name();

      assert.equal(name, 'DApp Token');
    })
  })
})