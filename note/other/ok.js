FeeMultiplier = 0.08;
MinFee = 8;

function getFee(amount) {
    let r = amount * FeeMultiplier;
    if (r > MinFee) {
        return r
    }
    return MinFee;
}

function cal(stockPrice, moneyIn, moneyOut) {
    // substract fee
    let availableMoneyToBuy = moneyIn - getFee(moneyIn)
    let unitToBuy = availableMoneyToBuy / stockPrice;
    unitToBuy = Math.ceil(unitToBuy);
    let sellMoney = moneyOut + getFee(moneyOut);
    let whenToSell = sellMoney / unitToBuy;

    return {
        unitToBuy: unitToBuy,
        whenToSell: whenToSell,
        sellMoney : sellMoney
    };
}

cal(0.23, 500, 600)