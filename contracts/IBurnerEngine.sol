pragma solidity ^0.5.5;

interface IBurnerEngine {

    function burn(uint256 amount) external;
    function burnFrom(address from, uint256 amount) external;


}
