pragma solidity >=0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    // all code goes here
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;

    mapping(address => bool) public hasStaked;

    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken)public{
        dappToken = _dappToken;
        daiToken = _daiToken;

    }

    // Stake Tokens (Deposit)

    function stakeTokens(uint _amount) public{

        // transfer mock dai token to this contract for staking (msg - global var)
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update Staking Balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add user to stakers array 

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        // update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;


    }

    // Unstaking Tokens (Withdraw)





    // Issuing Tokens

}


