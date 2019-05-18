pragma solidity ^0.5.5;
/*
    Shinra-corp

    Call this function when holder burn tokens.
    When Mako Token are burn, the holder receive Gil tokens.
    
*/
interface IBurnerEngine {

    function engineBurn(address from, uint amount) external;

}
