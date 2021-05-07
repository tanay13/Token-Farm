const DappToken = artifacts.require('DappToken');
const DaiToken = artifacts.require('DaiToken');
const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function(deployer, network, accounts) {
  //Deploy Mock Dai Token
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  //Deploy Dapp Token
  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();

  //Deploy TokenFarm
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  // Transfer all tokens to TokenFarm (1 million)
  // This looks more than million because it has 18 0s after decimal and we cannot store the value with decimals in solidity
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000');

  // Transfer 100 mock DAI tokens to investor
  await daiToken.transfer(accounts[1], '100000000000000000000');
};