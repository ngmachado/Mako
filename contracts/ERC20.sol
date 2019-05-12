pragma solidity 0.5.5;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import "./IERC20.sol";

/**

    Shinra-Corp ERC20 Mako

*/


contract ERC20 is IERC20 {
    
    using SafeMath for uint256;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);

    mapping(address => uint256) internal balances;
    mapping(address => mapping(address => uint256)) internal allowances;
    
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    uint256 private _totalSupply;


    constructor(string memory __name, string memory __symbol, uint8 __decimals) public {
        _name = __name;
        _symbol = __symbol;
        _decimals = __decimals;
    }


    function name() external view returns (string memory) {
        return _name;
    }


    function symbol() external view returns (string memory) {
        return _symbol;
    }


    function decimals() external view returns (uint8) {
        return _decimals;
    }


    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }


    function balanceOf(address _owner) external view returns (uint256) {
        return balances[_owner];
    }


    function transfer(address _to, uint256 _value) external returns (bool) {
        require(balances[msg.sender] >= _value, "not enough tokens");
        
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        
        emit Transfer(msg.sender, _to, _value);
        return true;
    }


    function transferFrom(address _from, address _to, uint256 _value) external returns (bool) {
        require(balances[_from] >= _value && allowances[_from][msg.sender] >= _value, 'not enough tokens');

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        allowances[_from][msg.sender].sub(_value);

        emit Transfer(_from, _to, _value);
        return true;
    }


    function approve(address _spender, uint256 _value) external returns (bool) {
        allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }


    function allowance(address _owner, address _spender) external view returns (uint256) {
        return allowances[_owner][_spender];
    }


    function _mint(address _to, uint256 _value) internal {
        _totalSupply = _totalSupply.add(_value);
        balances[_to] = balances[_to].add(_value);
    }


}
