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

contract('EthSwap', ([deployer, investor]) => {
  let ethSwap, token

  before(async () => {
    token = await Token.new();
    ethSwap = await EthSwap.new(token.address);
  })
  describe('EthSwap :: deployment', () => {

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

  describe('EthSwap :: buyTokens()', () => {
    let result;
    before(async () => {
      result = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether') });
    })

    it('Should allows user to instantly purchase tokens from EthSwap for a fixed price', async () => {
      const investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), tokensToWei('100'))

      let ethSwapBalance = await token.balanceOf(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), tokensToWei('999900'))

      ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'ether'))

      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokensToWei('100').toString())
      assert.equal(event.rate.toString(), '100')
    })
  })

  describe('EthSwap :: sellTokens()', () => {
    let result;
    before(async () => {
      // Investor must approve tokens before purchase
      await token.approve(ethSwap.address, tokensToWei('100'), { from: investor })
      result = await ethSwap.sellTokens(tokensToWei('100'), { from: investor });
    })

    it('Should allows user to instantly sell tokens to EthSwap for a fixed price', async () => {
      const investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), tokensToWei('0'))

      let ethSwapBalance = await token.balanceOf(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), tokensToWei('1000000'))
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'ether'))

      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokensToWei('100').toString())
      assert.equal(event.rate.toString(), '100')

      // FAILURE
      await ethSwap.sellTokens(tokensToWei('500'), { from: investor }).should.be.rejected;
    })
  })
})