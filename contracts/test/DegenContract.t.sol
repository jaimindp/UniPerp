// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/DegenContract.sol";

contract DegenTest is Test {
    DegenContract public c;
    address public constant wbtc = 0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f;

    function setUp() public {
        c = new DegenContract();
    }

    function test_trade() public {
        c.trade(wbtc, 100, 4, true);
    }
}
