pragma solidity ^0.5.12;

import "./DemystifyToken.sol";

contract DemystifyTokenSale {


    address payable admin;
    DemystifyToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(
        address _buyer,
        uint256 _amount
    );


    constructor (DemystifyToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }


    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function() external payable {
        buyTokensWithoutValue();
    }

    function buyTokensWithoutValue() public payable {
        uint _value = div(msg.value, tokenPrice);
        require(tokenContract.balanceOf(admin) >= _value);
        require(tokenContract.transfer(msg.sender, _value));

        tokensSold += _value;
        admin.transfer(msg.value);
        emit Sell(msg.sender, _value);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        require(tokenContract.balanceOf(admin) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;
        admin.transfer(msg.value);
        emit Sell(msg.sender, _numberOfTokens);
    }


    function endSale() public {
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        selfdestruct(msg.sender);


    }


}