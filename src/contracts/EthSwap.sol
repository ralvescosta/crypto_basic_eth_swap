pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
  string public name = "EthSwap Instance Exchange";
  uint public rate = 100;

  Token public token;

  event TokensPurchased(address account, address token, uint amount, uint rate);
  event TokensSold(address account, address token, uint amount, uint rate);

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
    emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
  }

  function sellTokens(uint _amount) public {
    // user can't sell more tokens than they have
    require(token.balanceOf(msg.sender) >= _amount);

    uint etherAmount = _amount / rate;

    // Require that EthSwap has enough tokens
    require(address(this).balance >= etherAmount);

    // Perform sale
    token.transferFrom(msg.sender, address(this), _amount);
    msg.sender.transfer(etherAmount);

    // Emit token sold event
    emit TokensSold(msg.sender, address(token), _amount, rate);
  }
}