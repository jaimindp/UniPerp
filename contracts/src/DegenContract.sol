// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IRouter} from "src/interfaces/IRouter.sol";
import {IPositionRouter} from "src/interfaces/IPositionRouter.sol";

contract DegenContract {
    address public constant POSITION_ROUTER =
        0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868; //arbitrum mainnet
    address public constant ROUTER = 0x5F719c2F1095F7B9fc68a68e35B51194f4b6abe8;

    constructor() {}

    function trade(
        address token,
        uint amount,
        uint leverage,
        bool isLong
    ) external {
        // approve position router plugin
        IRouter(ROUTER).approvePlugin(POSITION_ROUTER);
        // approve router in token
        ERC20(token).approve(ROUTER, amount);

        // create positon
        address[] memory _route = new address[](1);
        _route[0] = token;
        uint executionFee = IPositionRouter(POSITION_ROUTER).minExecutionFee();
        uint sizeDelta = leverage * amount;
        uint acceptablePrice;
        IPositionRouter(POSITION_ROUTER).createIncreasePosition(
            _route,
            token,
            amount,
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
