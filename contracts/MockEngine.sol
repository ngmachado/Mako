pragma solidity ^0.5.5;

import "./IBurnerEngine.sol";

contract MockEngine is IBurnerEngine {

    event Log(address indexed from, uint256 amount);
        constructor() public {}

    function engineBurn(address from, uint256 amount) external {
        emit Log(from, amount);
    }

    function() external payable { revert(); }

}
