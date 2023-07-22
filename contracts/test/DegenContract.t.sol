// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/DegenContract.sol";

contract DegenTest is Test {
    DegenContract public c;

    function setUp() public {
        c = new DegenContract();
    }
}
