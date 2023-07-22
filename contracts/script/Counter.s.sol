// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {DegenContract} from "src/DegenContract.sol";

contract CounterScript is Script {
    DegenContract d;
    address usdc = 0xaf88d065e77c8cC2239327C5EDb3A432268e5831;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        d = new DegenContract();
        usdc.call(
            abi.encodeWithSignature(
                "transfer(address,uint256)",
                address(d),
                10 * 1e7
            )
        );
        vm.stopBroadcast();
    }
}
