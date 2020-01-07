let DemystifyTokenSale = artifacts.require("DemystifyTokenSale");
let DemystifyToken = artifacts.require("DemystifyToken");

contract("DemystifyTokenSale", function (accounts) {

    it("has been initialized", function () {
        let tokenInstance;
        DemystifyTokenSale.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.adress;
        }).then(function (address) {
            assert.notEqual(address, "aez", "Has been deployed")
        })
    });
    it("test Function", function () {
        let tokenInstance;
        let tokenSaleInstance;
        let tokenPrice = 1000000000000000;
        let admin = accounts[0];
        let buyer = accounts[1];
        let tokensAvailable = 610000000000;
        let numberOfTokens = 20;

        DemystifyToken.deployed().then(function (instance) {
            tokenInstance = instance;
            DemystifyToken.deployed().then(function (instance) {
                tokenSaleInstance = instance;
                tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin});
                return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: numberOfTokens * tokenPrice})
            }).then(function (receipt) {
                assert.equal(receipt.logs.length, 1, 'triggers one event');
                assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
                assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
                assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');

                assert.notEqual(address, "aez", "Has been deployed")
            })
        })

    })
});