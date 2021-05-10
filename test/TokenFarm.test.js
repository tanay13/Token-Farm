const { assert } = require('chai');
const _deploy_contracts = require('../migrations/2_deploy_contracts');

const DappToken = artifacts.require('DappToken');
const DaiToken = artifacts.require('DaiToken');
const TokenFarm = artifacts.require('TokenFarm');

require('chai')
  .use(require('chai-as-promised'))
  .should();
function token(n) {
  return web3.utils.toWei(n, 'ether');
}
contract('TokenFarm', ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm;
  before(async () => {
    //load contracts
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    //transfer all Dapp tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, token('1000000'));

    // send tokens to invester
    await daiToken.transfer(investor, token('100'), { from: owner });
  });

  describe('Mock DAI deployment', async () => {
    it('has a name', async () => {
      const name = await daiToken.name();
      assert.equal(name, 'Mock DAI Token');
    });
  });
  describe('Dapp Token deployment', async () => {
    it('has a name', async () => {
      const name = await dappToken.name();
      assert.equal(name, 'DApp Token');
    });
  });
  describe('Token Farm deployment', async () => {
    it('has a name', async () => {
      const name = await tokenFarm.name();
      assert.equal(name, 'Dapp Token Farm');
    });
    it('contract has tokens', async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), token('1000000'));
    });
  });

  describe('Farming Token', async () => {
    it('reward investors for staking mDai', async () => {
      let result;

      // Check investor balance before staking
      result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        token('100'),
        'Investor balance correct for staking'
      );

      // stake mock Dai tokens
      await daiToken.approve(tokenFarm.address, token('100'), {
        from: investor,
      });
      await tokenFarm.stakeTokens(token('100'), { from: investor });

      // Check Staking Result
      result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        token('0'),
        'investor mock Dai wallet balance correct after staking'
      );

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(
        result.toString(),
        token('100'),
        'Token farm mock Dai balance correct after staking'
      );

      result = await tokenFarm.stakingBalance(investor);
      assert.equal(
        result.toString(),
        token('100'),
        'investor staking balance correct after staking'
      );

      result = await tokenFarm.isStaking(investor);
      assert.equal(
        result.toString(),
        'true',
        'investor staking status correct after staking'
      );

      //issue tokens
      await tokenFarm.issueToken({ from: owner });

      // check balances after issuance
      result = await dappToken.balanceOf('investor');
      assert.equal(
        result.toString(),
        token('100'),
        'investor wallet balance correct after issuance'
      );

      // Ensure only owner can issue tokens
      await tokenFarm.issueToken({ from: investor }).should.be.rejected;
    });
  });
});
