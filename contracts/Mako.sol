pragma solidity ^0.5.0;

import "./ERC20.sol";
import "./IBurnerEngine.sol";

/**
    Shinra-Corp ERC20 Mako
*/


contract Mako is ERC20 {

    event PaymentProxy(address indexed from, address indexed to, uint256 amount, uint256 tokens);
    event GasUnits(address indexed from, uint256 gasUnits);

    address public owner;
    uint256 public gasUnits;
    address public engine;

    bool private _inOpr;


    constructor(address _engine) ERC20("Mako", "MAKO", 18) public { 
        owner = msg.sender;
        gasUnits = 23000;
        engine = _engine;
    }
    

    function proxyPayment(address payable _destination) external payable lock {
        require(msg.value > 0, 'Payments proxy only');
        
        uint256 amount = _mintAmount();
        _destination.transfer(msg.value);
        _mint(msg.sender, amount);
        
        emit PaymentProxy(msg.sender, _destination, msg.value, amount);
    }
    

    function burn(uint256 _amount) external {
        require(balances[msg.sender] >= _amount, "not enough tokens");

        balances[msg.sender] = balances[msg.sender].sub(_amount);
    }


    function burnFrom(address _from, uint256 _amount) external {

        require(balances[_from] >= _amount && allowances[_from][msg.sender] >= _amount, "not enough tokens");

        balances[_from] = balances[_from].sub(_amount);
        allowances[_from][msg.sender] = allowances[_from][msg.sender].sub(_amount);

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

    function callEngine(address _from, uint256 _amount) internal {
        IBurnerEngine _engine = IBurnerEngine(engine);
        _engine.engineBurn(_from, _amount);
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
