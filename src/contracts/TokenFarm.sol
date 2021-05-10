pragma solidity >=0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    // all code goes here
    string public name = "Dapp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;

    mapping(address => bool) public hasStaked;

    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken)public{
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;

    }

    // Stake Tokens (Deposit)

    function stakeTokens(uint _amount) public{


        // require amount greater than -
        require(_amount>0,"amount cannot be 0");

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

    function unstakeTokens() public{

        //getting staking balance
        uint balance =  stakingBalance[msg.sender];

        //require amount greater than 0
        require(balance>0,"staking balance cannot be 0");

        // Transfer Mock Dai tokens to this contract for staking
        daiToken.transfer(msg.sender,balance);

        // reset staking balance
        stakingBalance[msg.sender] = 0;

        // update staking status
        isStaking[msg.sender] = false;



    }


    // Issuing Tokens

    function issueToken() public{

        require(msg.sender == owner,"caller must be the owner");
        for(uint i=0;i<stakers.length;i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance>0){
                dappToken.transfer(recipient,balance);
            }
        }
    }

}


