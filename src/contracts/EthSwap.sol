pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
  string public name = "EthSwap Instance Exchange";

  Token public token;

  constructor(Token _token) public {
    token = _token;
  }

}