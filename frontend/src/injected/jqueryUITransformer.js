import $ from 'jquery';
import chooseTokenBlock from './html/chooseTokenBlock.html';
import leverageInput from './html/leverageInput.html';

import swapCheckPopup from './html/swapCheckPopup.html';
import transactionWaiting from './html/transactionWaiting.html';
import flintButtonWrapper from './html/flintButtonWrapper.html';
import signatureRejectPopup from './html/signatureRejectPopup.html';
import transactionSuccessPopup from './html/transactionSuccessPopup.html';
import {
    handleApproval,
    handleSwap,
    handleTokenChange,
    getGaslessApprovalSupported,
} from './flintButtonState';
import chainIdLogo from '../injected/configs/chainIdLogo.json';
import { getCurrenyNetwork } from './store/store';
import { getTokenBalance } from '../utils/ERC20Utils';
import { ethers } from 'ethers';
import degenContract from '../abis/degenContract.json';
import ERC20 from '../abis/ERC20.json';
import iPosition from '../abis/gmx.json';

let parent;
let parentFlint;

let currencySelector1;
let currencySelector2;

let fromCurrency;
let toCurrency;
let fromImgSrc;
let toImgSrc;
let fromInput;
let toInput;

let dd2;

let gasInToToken = 0;

const swapButtons = ['flint-swap-conf', 'flint-swap'];

const getSignificantDigits = (num) => {
    num = Number(num);
    if (num > 0.01) {
        num = num.toFixed(2);
    } else if (num > 0.0001) {
        num = num.toFixed(4);
    } else {
        num = num.toFixed(6);
    }
    return num;
};

export const setGasInToToken = (gas) => {
    if (gas) {
        gasInToToken = gas;
    }
    setToTokenFinalPrice();
};

export const setGasInFromToken = (gas, fromPrice) => {
    if (gas) {
        gas = getSignificantDigits(gas);
        fromPrice = getSignificantDigits(fromPrice);
        $('#fl-gs-cnt-bx').show(100);
        $('#fl-gs-cnt-bx')
            .children('div')
            .children('p')
            .html(`Fees: <b>${gas} ${fromCurrency}</b> ($${fromPrice})`);
    } else {
        $('#fl-gs-cnt-bx').hide(100);
    }
};

const setToTokenFinalPrice = () => {
    if (toInput.val()) {
        const inpValue = Number(toInput.val());
        let finalPrice = Number(inpValue - gasInToToken);
        if (finalPrice > 0.0001) {
            finalPrice = finalPrice.toFixed(4);
        }
        $('#fl-to-amt').html(finalPrice);
    }
};

export const disableSwapButton = () => {
    swapButtons.forEach((btn) => {
        $(`#${btn}`).css('background-color', 'rgb(41, 50, 73)');
        $(`#${btn}`).css('color', 'rgb(152, 161, 192);');
        $(`#${btn}`).css('cursor', 'default');
        $(`#${btn}`).css('pointer-events', 'none');
    });
};

export const enableSwapButton = () => {
    const target = dd2
        .children('div:nth-child(3)')
        ?.children('div:first-child');
    target?.on({
        DOMSubtreeModified: () => {
            $('#fl-cr-exch-rate').html(target.html());
        },
    });
    swapButtons.forEach((btn) => {
        $(`#${btn}`).css('background-color', 'rgb(76, 130, 251)');
        $(`#${btn}`).css('color', 'rgb(245, 246, 252)');
        $(`#${btn}`).css('cursor', 'pointer');
        $(`#${btn}`).css('pointer-events', 'auto');
    });
    setTimeout(() => {
        if (fromInput.val()) {
            $('#fl-from-amt').html(fromInput.val());
        }
        setToTokenFinalPrice();
    }, 200);
};

export const showApprove = () => {
    $('#flint-approve').show();
    $('#flint-swap').hide();
};

export const hideApprove = () => {
    $('#flint-approve').hide();
    $('#flint-swap').show();
};

export const showLoaderApprove = () => {
    $('#flint-approve').html('');
    $('#flint-approve').addClass('button--loading');
    $('#flint-approve').css('background-color', 'rgb(41, 50, 73)');
    $('#flint-approve').css('color', 'rgb(152, 161, 192);');
};

export const hideLoaderApprove = () => {
    $('#flint-approve').html(
        getGaslessApprovalSupported() ? 'Approve' : 'Approve (gas needed)'
    );
    $('#flint-approve').removeClass('button--loading');
    $('#flint-approve').css('background-color', 'rgb(76, 130, 251)');
    $('#flint-approve').css('color', 'rgb(245, 246, 252)');
};

export const showTransactionSuccessPopup = () => {
    $('#flppbxtrasuc').fadeIn(200);
};

export const hideTransactionSuccessPopup = () => {
    $('#flppbxtrasuc').fadeOut(200);
};

export const showRejectPopup = () => {
    $('#flppbxsigrj').fadeIn(200);
};

export const hideRejectPopup = () => {
    $('#flppbxsigrj').fadeOut(200);
};

export const showWaitingPopup = () => {
    $('#flppbxwtg').fadeIn(200);
};

export const hideWaitingPopup = () => {
    $('#flppbxwtg').fadeOut(200);
};

export const showSwapPopup = () => {
    $('#flppbx').fadeIn(200);
};

export const hideSwapPopup = () => {
    $('#flppbx').fadeOut(200);
};

export const switchToSwap = () => {
    $('#flint-approve').hide();
    $('#flint-swap').show();
};

export const disableService = () => {
    select_dapp_for_swap();
    $('#fl-gas-sl2').addClass('disabled');
    $('#flint-error-message').show();
};

export const enableService = () => {
    select_flint_for_swap();
    $('#fl-gas-sl2').removeClass('disabled');
    $('#flint-error-message').hide();
};

export const setNativeTokenNameAndLogo = () => {
    console.log(
        'CHANGING NATIVE TOKEN LOGO AND NAME!',
        chainIdLogo[getCurrenyNetwork()].image,
        chainIdLogo[getCurrenyNetwork()].name,
        getCurrenyNetwork()
    );
    $('#fl-native-token-im').attr(
        'src',
        chainIdLogo[getCurrenyNetwork()].image
    );
    $('#fl-native-token').html(chainIdLogo[getCurrenyNetwork()].name);
};

const enable_flint = () => {
    parent.hide();
    parentFlint.show();
};

const disable_flint = () => {
    parent.show();
    parentFlint.hide();
};

const select_flint_for_swap = () => {
    enable_flint();
    $('#fl-ck-a1').hide();
    $('#fl-ck-ina1').show();
    $('#fl-ck-a2').show();
    $('#fl-ck-ina2').hide();
};

const select_dapp_for_swap = () => {
    disable_flint();
    $('#fl-ck-a1').show();
    $('#fl-ck-ina1').hide();
    $('#fl-ck-a2').hide();
    $('#fl-ck-ina2').show();
};

const insertPopupHtml = () => {
    $('body').append(swapCheckPopup);
    $('body').append(transactionWaiting);
    $('body').append(signatureRejectPopup);
    $('body').append(transactionSuccessPopup);
    $('.fl-pop-bk')
        .off()
        .on('click', function () {
            $(this).fadeOut(100);
        });
    $('.fl-pop-cnt')
        .off()
        .on('click', function (e) {
            e.stopPropagation();
        });
    $('.fl-p-cl')
        .off()
        .on('click', function (e) {
            $('.fl-pop-bk').fadeOut(100);
        });
};

function externalAPI() {
    window.ethereum.request({ method: 'eth_requestAccounts' }).then(onAccounts);

    const tokenInputValue = parseInt($('.token-amount-input').val());
    const leverageInputValue = parseInt($('#leverage-amount-input').val());
    const isLong = leverageInputValue >= 0;
    console.log('token input value ' + tokenInputValue);
    console.log('leverage input value ' + leverageInputValue);

    console.log('external api called');
}

const insertGasTokenBlock = () => {
    const main = $('#swap-page');
    if (main && main.length > 0) {
        fromInput = main.children('input:first-child');
        toInput = main.children('input:nth-child(2)');
        currencySelector1 = main
            .children('div:nth-child(2)')
            ?.children('div:first-child')
            ?.children('div:first-child')
            ?.children('div:first-child')
            ?.children('div:first-child')
            ?.children('button');
        fromInput = currencySelector1.parent().children('input');
        fromInput.on({
            keyup: () => {
                if (!fromInput.val()) {
                    disableSwapButton();
                } else {
                    $('#fl-from-amt').html(fromInput.val());
                }
            },
            change: () => {
                if (!fromInput.val()) {
                    disableSwapButton();
                } else {
                    $('#fl-from-amt').html(fromInput.val());
                }
            },
        });
        fromCurrency = currencySelector1
            .children('span')
            ?.children('div')
            ?.children('span')
            ?.html();
        fromImgSrc = currencySelector1.find('img').attr('src');
        setTimeout(() => {
            fromImgSrc = currencySelector1.find('img').attr('src');
            $('#fl-from-token-im').attr('src', fromImgSrc);
            $('#fl-from-token').html(fromCurrency);
            $('#fl-from-im').attr('src', fromImgSrc);
            $('#fl-from-crr').html(fromCurrency);
        }, 200);
        currencySelector1?.on({
            DOMSubtreeModified: (e) => {
                fromCurrency = currencySelector1
                    .children('span')
                    ?.children('div')
                    ?.children('span')
                    ?.html();
                console.log('THIS IS THE FROM CURRENCY - ', fromCurrency);
                fromImgSrc = currencySelector1.find('img').attr('src');
                setTimeout(() => {
                    fromImgSrc = currencySelector1.find('img').attr('src');
                    $('#fl-from-token-im').attr('src', fromImgSrc);
                    $('#fl-from-token').html(fromCurrency);
                    $('#fl-from-im').attr('src', fromImgSrc);
                    $('#fl-from-crr').html(fromCurrency);
                    handleTokenChange(fromCurrency, fromInput.val());
                }, 200);
            },
        });

        currencySelector2 = main
            .children('div:nth-child(3)')
            ?.children('div:first-child')
            ?.children('div:first-child')
            ?.children('div:first-child')
            ?.children('div:first-child')
            ?.children('div:first-child')
            ?.children('button');
        toInput = currencySelector2.parent().children('input');
        toInput.on('input', function () {
            setToTokenFinalPrice();
            // alert($(this).val());
        });
        toInput.on({
            change: () => {
                setToTokenFinalPrice();
            },
        });
        currencySelector2?.on({
            DOMSubtreeModified: (e) => {
                toCurrency = currencySelector2
                    .children('span')
                    ?.children('div')
                    ?.children('span')
                    ?.html();
                setTimeout(() => {
                    toImgSrc = currencySelector2.find('img').attr('src');
                    $('#fl-to-im').attr('src', toImgSrc);
                    $('#fl-to-crr').html(toCurrency);
                }, 200);
            },
        });
        main.children('div:nth-child(3)')
            ?.children('div:first-child')
            ?.on({
                DOMSubtreeModified: (e) => {
                    setTimeout(() => {
                        if (fromInput.val()) {
                            $('#fl-from-amt').html(fromInput.val());
                        }
                        setToTokenFinalPrice();
                    }, 200);
                },
            });

        const dd = main.children('div:nth-child(3)');
        if (dd && dd.length > 0) {
            dd2 = dd.children('div:first-child');
            dd2.children('div:first-child').css('border-bottom', 'none');
            dd2.css('border-radius', '12px');
            dd2.css('overflow', 'hidden');
            dd2.append(leverageInput);
            $('#leverage-final-amount').css('text-align', 'right');
            $('#fusion-button').hide();

            // reset button
            $('#leverage-reset-button')
                .off()
                .on('click', () => {
                    const inputValue = $('#leverage-amount-input').val();
                    $('#leverage-amount-input').val(0);
                    $('#leverage-final-amount').text('$' + 0.0);
                    $('#leverage-percent').text('Leverage: ' + 0 + '%');
                    $('.sc-1kykgp9-0.sc-1pv2uhy-6').show();
                    $('#swap-button').show();
                    $('#fusion-button').hide();

                    if (
                        parseFloat(inputValue) > -50 &&
                        parseFloat(inputValue) < 50
                    ) {
                        // Log the value to the console
                        console.log('LEVERAGE Field Value:', inputValue);

                        // Add your logic here to perform actions when the value is within the range
                    } else {
                        // If the value is not within the specified range, you can add a message or handle it accordingly
                        console.log(
                            'LEVERAGE Value is not within the range of -50 to 50.'
                        );
                    }
                });

            // input monitoring
            $('#leverage-amount-input').on('input', function () {
                let inputValue = $(this).val();
                let inputElements = $('.token-amount-input');
                let inputAmount = $(inputElements[1]).val();
                
                $('#leverage-final-amount').text('$' + inputValue * inputAmount);
                $('#leverage-percent').text('Leverage: ' + inputValue + 'x');
                $('#leverage-final-amount').css('text-align', 'right');

                if (parseFloat(inputValue) == 0) {
                    $('.sc-1kykgp9-0.sc-1pv2uhy-6').show();
                    $('.css-yjtn9t').text('Swap');
                    alert('refresh page, swap disconnected');
                    $('.sc-1kykgp9-0.sc-1pv2uhy-6').show();
                } else if (
                    parseFloat(inputValue) > -50 &&
                    parseFloat(inputValue) < 50
                ) {
                    if (
                        parseFloat(inputValue) < 50 &&
                        parseFloat(inputValue) > 0
                    ) {
                        $('#swap-button').hide();
                        $('#fusion-button').show();
                        $('#fusion-button').removeAttr('disabled');
                        $('#fusion-text').text('Long Token');
                        $('#fusion-button').on('click', externalAPI);
                    } else if (
                        parseFloat(inputValue) > -50 &&
                        parseFloat(inputValue) < 0
                    ) {
                        $('#swap-button').hide();
                        $('#fusion-button').show();
                        $('#fusion-button').removeAttr('disabled');
                        $('#fusion-text').text('Short Token');
                        $('#fusion-button').on('click', externalAPI);            
                    }
                    $('.sc-1kykgp9-0.sc-1pv2uhy-6').hide();
                } else {
                    console.log('out of bounds error');
                }
            });
        }
    }
};

async function onAccounts(accounts) {
    let account = accounts[0];
    // console.warn('account i', account);
    const provider = new _ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner(account);
    // console.warn('balance', await signer.getBalance());

    let contractAddresses = {
        usdc: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        btc: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    };

    let price = 29886;
    // let formatPrice = _ethers.utils.parseUnits((price * 10e30).toString(), 30);

    let deployedContract = '0x30421A411Ec76AA0Cf0103b04E8f777301333A9D';
    let positionRouter = '0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868';
    let router = '0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064';

    let abi = degenContract;
    let ERC20abi = ERC20;
    let iPositionAbi = iPosition;

    const USDCcontract = new _ethers.Contract(
        contractAddresses.usdc,
        ERC20abi,
        signer
    );

    // await USDCcontract.transfer(router, 10000000);
    // await USDCcontract.approve(router, 10000000);

    const contract = new _ethers.Contract(positionRouter, iPositionAbi, signer);

    // _route, array of addresses [usdc, btc]
    // token, [wbtc]
    // amountIn, 10000000
    // 0, //minOut - 0 bc no swap 0
    // sizeDelta, leverage * (amountIn/ 1e6) * 1e30 ()
    // isLong, True
    // acceptablePrice, _ethers.BigNumber.from(price, 30),
    // executionFee, 215000000000000
    // 0, referral
    // address(0) callbackcontract

    let data = {
        address: positionRouter,
        amountIn: 10000000,
        leverage: 5,
        price: price,
        isLong: true,
    };

    // let executionFee = IPositionRouter(POSITION_ROUTER).minExecutionFee();

    // let msgVal = {msg.value: 215000000000000}
    // console.log(data.leverage * (data.amountIn / 1e6) * 1e30);
    let str = (data.amountIn * data.leverage).toString();
    let sizeDelta = _ethers.utils.parseUnits(str, '24');

    let pstr = (29886).toString();
    let priceP = _ethers.utils.parseUnits(pstr, '30');
    // let ref = _ethers.utils.formatBytes32String('');

    try {
        const result = await contract.createIncreasePosition(
            [contractAddresses.usdc, contractAddresses.btc],
            contractAddresses.btc,
            data.amountIn,
            0,
            sizeDelta,
            data.isLong,
            priceP,
            215000000000000,
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000000000000000000000000000',
            { value: 215000000000000, gasLimit: 150000000 }
        );

        // const result = await contract.trade(
        //     data.address,
        //     data.amountIn,
        //     data.leverage,
        //     data.price,
        //     data.isLong,
        //     { value: 215000000000000, gasLimit: 15000000 }
        // );
        console.log('result', result);
    } catch (error) {
        console.error('error', error);
    }

    // await signer.sendTransaction;

    // await signer.sendTransaction({
    //     to: '0x89d9Dd2e85ecC305E276f51BB21fd4C708Be9487',
    //     data: '0x',
    // });
}

window.ethereum.request({ method: 'eth_requestAccounts' }).then(onAccounts);

export const addFlintUILayer = (callback) => {
    const swapBtnOriginal = $('#swap-button');
    parent = swapBtnOriginal.parent();

    if (swapBtnOriginal.length > 0) {
        insertPopupHtml();
        insertGasTokenBlock();
    }

    parent.parent().append(flintButtonWrapper);

    $('#flint-swap')
        .off()
        .on('click', function () {
            callback();
        });
    $('#flint-swap-conf')
        .off()
        .on('click', function () {
            handleSwap();
            hideSwapPopup();
            showWaitingPopup();
            $('#fl-swp-for').html(
                `Swapping ${fromInput.val()} ${fromCurrency} for ${toInput.val()} ${toCurrency}`
            );
        });
    $('#flint-approve')
        .off()
        .on('click', function () {
            handleApproval();
        });

    parentFlint = $('#tg_fl');
    return swapBtnOriginal.length;
};

export const insufficientBalance = () => {
    $('#flint-swap').html(`Insufficient ${fromCurrency} balance`);
};

export const activeSwap = () => {
    $('#flint-swap').html(`Swap`);
};

export const beginTransactionLoader = (callback) => {
    console.log('swapping using USDT as gas');
    $('#flint-swap-conf').html('');
    $('#flint-swap-conf').addClass('button--loading');
    $('.fn-lk-sc').remove();
    disableBtn();
    callback();
};

export const showTransactionHash = (hash, callback) => {
    $('#flint-swap').html('Swap');
    $('#flint-swap').removeClass('button--loading');
    enableButton();
    parent.parent()
        .append(`<a class="fn-lk-sc" target="_blank" href="https://polygonscan.com/tx/${hash}"><p style="margin: 0 5px 0 0; color: rgb(130, 71, 229);">Check transaction status on Polygon Scan</p>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" fill="rgb(130, 71, 229)">
  <path d="M 5 3 C 3.9069372 3 3 3.9069372 3 5 L 3 19 C 3 20.093063 3.9069372 21 5 21 L 19 21 C 20.093063 21 21 20.093063 21 19 L 21 12 L 19 12 L 19 19 L 5 19 L 5 5 L 12 5 L 12 3 L 5 3 z M 14 3 L 14 5 L 17.585938 5 L 8.2929688 14.292969 L 9.7070312 15.707031 L 19 6.4140625 L 19 10 L 21 10 L 21 3 L 14 3 z"/>
  </svg></a>`);
    callback();
};

export const updatePriceValues = () => {
    setTimeout(() => {
        const to = toInput.val();
        const from = fromInput.val();
        if (to.length > 0) {
            setToTokenFinalPrice();
        }
        if (from.length > 0) {
            $('#fl-from-amt').html(from);
        }
    }, 200);
};

export const getFromCurrency = () => {
    return fromCurrency;
};

export const getToCurrency = () => {
    return toCurrency;
};

export const getFromInput = () => {
    return fromInput;
};

export const getToInput = () => {
    return toInput;
};

