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

    bool private _inOpr;


    constructor(address engine) ERC20("Mako", "MAKO", 18, engine) public { 
        owner = msg.sender;
        gasUnits = 23000;
    }
    

    function proxyPayment(address payable _destination) external payable lock {
        require(msg.value > 0, 'Payments proxy only');
        
        uint256 amount = _mintAmount();
        _destination.transfer(msg.value);
        _mint(msg.sender, amount);
        
        emit PaymentProxy(msg.sender, _destination, msg.value, amount);
    }


    function setGasUnits(uint256 _units) public isOwner {
        require(_units > 0, "cant stop minting of new tokens");
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

    function collectBalance() public isOwner lock {
        msg.sender.transfer(address(this).balance);
    }
    
    
    function() external payable {
        revert();
    }

    modifier isOwner() {
       require(msg.sender == owner);
       _;
    }

    modifier lock() {
        require(!_inOpr, 'working on something');
        _inOpr = true;
        _;
        _inOpr = false;  
    }
}
