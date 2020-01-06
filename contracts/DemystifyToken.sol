pragma solidity ^0.5.12;


contract DemystifyToken {

    string public name = "name";
    string public symbol = "dem";
    string public standard = "Token v0.1";
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    event Transfer(
        address  indexed _from,
        address  indexed _to,
        uint256 _value
    );

    event Approval(
        address  indexed _owner,
        address  indexed _spender,
        uint256 _value
    );
    constructor (uint256 _initialSupply) public  {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;

    }

    function transfer(address _to, uint256 _value) public
    returns (bool success){
        require(_value < balanceOf[msg.sender]);
        balanceOf[_to] += _value;
        balanceOf[msg.sender] -= _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    function approve(address _spender, uint256 _value) public
        returns (bool success){

        emit Approval(msg.sender,_spender,_value);
        return true;

    }

}