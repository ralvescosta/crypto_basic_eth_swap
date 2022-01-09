pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
  string public name = "EthSwap Instance Exchange";
  uint public rate = 100;

  Token public token;

  event TokenPurchased(address account, address token, uint amount, uint rate);

  constructor(Token _token) public {
    token = _token;
  }

  function buyTokens() public payable {
    // 1 Eth == 100Depp (Redemption Rate)
    uint tokenAmount = msg.value * rate;

    // Require that EthSwap has enough tokens
    require(token.balanceOf(address(this)) >= tokenAmount);

    token.transfer(msg.sender, tokenAmount);

    // Emit token pruchase event
    emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
  }
}