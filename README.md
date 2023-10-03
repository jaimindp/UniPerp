# UniPerp (GLSwaps) - Leverage on Uniswap

From Uniswap, users can access on-chain perpetual markets. Injecting the smart contracts for derivatives by adding a leverage button and slider. For degens.

## Problem
- In CeFi there are spot and perp markets within the same platforms e.g. Binance (but not in DeFi)
- Futures volumes spot vs derivatives are 1-2%, in CeFi it’s 76.1%, there's a huge amount of expansion to go and that's because the futures perpetuals markets are fragmented and unknown.
- There aren’t integrated spot and derivatives trading in the same platform
- Crypto users are very sticky to their favourite tools and so we're bringing that experience to them.

## Solution

- A browser extension that lets you swap on GMX perpetual platform from the Uniswap frontend.
- Set leverage settings from app.uniswap.org and execute the transaction which puts in a leveraged trade on the derivatives platform.
- Get up to 50X leverage going long and short for any tokens offered by both Uniswap and DYDX
- By injecting the GMX smart contracts into the frontend of Uniswap, users can trade frictionlessly and get access to greater capital efficiency

## How it's Made

- A browser extension that lets you swap on a perpetual platform from the Uniswap frontend.
- Set leverage settings from app.uniswap.org and execute the transaction which puts in a leveraged trade on the derivatives platform.
- Got price data from 1inch API to swap trades on arbitrum
- Added WalletConnect within a chrome pop up to sign into wallet
- Sign in through Metamask and accessing the window ethereum object to ensure trades work
