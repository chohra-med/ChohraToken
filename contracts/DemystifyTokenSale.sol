pragma solidity ^0.5.12;

import "./DemystifyToken.sol";

contract DemystifyTokenSale {

    address payable admin;
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

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        require(multiply(tokenPrice, _numberOfTokens) == msg.value);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokenSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        selfdestruct(admin);

    }


}