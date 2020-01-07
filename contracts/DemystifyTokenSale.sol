pragma solidity ^0.5.12;

import "./DemystifyToken.sol";

contract DemystifyTokenSale {

    address  admin;
    DemystifyToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokenSold;

    event Sell(
        address indexed _buyer,
        uint256 _value
    );
    constructor (DemystifyToken _tokenContract, uint256 _tokenPrice
    ) public
    {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberToken) public payable {
        require(tokenContract.balanceOf(this) >= _numberToken);
        require(multiply(tokenPrice, _numberToken) == msg.value);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokenSold += _numberToken;
        emit Sell(msg.sender, _numberToken);
    }

    function endSale() public {

        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));
        selfdestruct(admin);

    }


}