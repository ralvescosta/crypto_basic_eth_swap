const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");


module.exports = async function(deployer) {
  // deploy token
  await deployer.deploy(Token);
  const token = await Token.deployed()

  // deploy ethSwap
  await deployer.deploy(EthSwap);
  const ethSwap = await EthSwap.deployed();

  // transfer tokens to ethSwap (1 million)
  await token.transfer(ethSwap.address, '1000000000000000000000000')
};
