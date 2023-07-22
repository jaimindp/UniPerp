// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IRouter} from "src/interfaces/IRouter.sol";
import {IPositionRouter} from "src/interfaces/IPositionRouter.sol";

contract DegenContract {
    address public constant POSITION_ROUTER =
        0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868; //arbitrum mainnet
    address public constant ROUTER = 0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064;

    constructor() {}

    function trade(
        address token,
        uint amountIn,
        uint leverage,
        bool isLong
    ) external {
        // approve position router plugin
        IRouter(ROUTER).approvePlugin(POSITION_ROUTER);
        // approve router in token
        ERC20(token).approve(ROUTER, amountIn);

        // create positon
        address[] memory _route = new address[](1);
        _route[0] = token;

        // from the gmx docs: USD values for _sizeDelta and _price are multiplied by (10 ** 30), so for example to open a long position of size 1000 USD, the value 1000 * (10 ** 30) should be used
        uint executionFee = IPositionRouter(POSITION_ROUTER).minExecutionFee();
        uint sizeDelta = leverage * amountIn * 1e30;
        uint acceptablePrice = 29886 * 1e30; //btc price
        IPositionRouter(POSITION_ROUTER).createIncreasePosition(
            _route,
            token,
            amountIn,
            0, //minOut - 0 bc no swap
            sizeDelta,
            isLong,
            acceptablePrice,
            executionFee,
            0,
            address(0)
        );
    }
}
