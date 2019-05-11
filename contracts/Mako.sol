pragma solidity ^0.5.0;

import "./ERC20.sol";

/**

    Shinra-Corp ERC20 Mako

*/


contract Mako is ERC20 {

    event PaymentProxy(address indexed from, address indexed to, uint256 amount, uint256 tokens);
    event GasUnits(address indexed from, uint256 gasUnits);

    address public owner;
    uint256 public gasUnits;


    constructor() ERC20("Mako","MAKO",18) public { 
        owner = msg.sender;
        gasUnits = 23000;
    }
    

    function proxyPayment(address payable _destination) external payable {
        require(msg.value > 0, 'Payments proxy only');
        
        uint256 amount = _mintAmount();
        _destination.transfer(msg.value);
        _mint(msg.sender, amount);
        
        emit PaymentProxy(msg.sender, _destination, msg.value, amount);
    }


    function setGasUnits(uint256 _units) public isOwner {
        gasUnits = _units;
        emit GasUnits(msg.sender, _units);
    }


    function _mintAmount() internal view returns (uint256) {
       return (tx.gasprice * gasUnits / 2);
    }


    function changeOwner(address newOwner) public isOwner {
       require(newOwner != address(0), "not a valid address (0)");
       owner = newOwner;
    }


    modifier isOwner() {
       require(msg.sender == owner);
       _;
    }


}
