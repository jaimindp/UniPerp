// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/DegenContract.sol";
import "forge-std/console.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DegenTest is Test {
    DegenContract public c;
    address public constant usdc = 0xaf88d065e77c8cC2239327C5EDb3A432268e5831;
    address public constant wbtc = 0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f;
    uint amount = 10000000;

    function setUp() public {
        c = new DegenContract();
        // give this contract amount usdc
        deal(usdc, address(c), amount);
        console.log(ERC20(usdc).balanceOf(address(c)));
    }

    function test_trade() public {
        c.trade{value: 215000000000000}(wbtc, amount, 4, true);
    }
}
