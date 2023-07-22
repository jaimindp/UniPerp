// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Router} from "gxm-contracts/core/interfaces/IRouter.sol";

contract DegenContract {
    address public constant POSITION_ROUTER =
        0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868; //arbitrum mainnet
    address public constant ROUTER = 0x5F719c2F1095F7B9fc68a68e35B51194f4b6abe8;

    constructor() {}

    function trade(address token, uint amount) {
        IRouter(ROUTER).approvePlugin(POSITION_ROUTER);
        ERC20(token).approve(ROUTER, amount);
    }
}
