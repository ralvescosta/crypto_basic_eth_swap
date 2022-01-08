/* eslint-disable no-undef */
const { assert } = require('chai');

const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

require('chai')
  .use(require('chai-as-promised'))
  .should()

const tokensToWei = (tokens) => {
  return web3.utils.toWei(tokens, 'ether');
}

contract('EthSwap', (accounts) => {
  describe('EthSwap deployment', () => {
    let ethSwap, token

    before(async () => {
      ethSwap = await EthSwap.new();
      token = await Token.new();
    })

    it('should contract has a name', async () => {
      const name = await ethSwap.name();

      assert.equal(name, 'EthSwap Instance Exchange');
    })

    it('should contracts has tokens', async () => {
      await token.transfer(ethSwap.address, tokensToWei('1000000'))

      const balance = await token.balanceOf(ethSwap.address)
      assert.equal(balance.toString(), tokensToWei('1000000'))
    })
  })
})