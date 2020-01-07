let DemystifyTokenSale = artifacts.require("DemystifyTokenSale");
let DemystifyToken = artifacts.require("DemystifyToken");

contract("DemystifyTokenSale", function (accounts) {
    let tokenInstance;
    let tokenSaleInstance;
    let tokenPrice = 1000000000000000;
    let admin = accounts[0];
    let buyer = accounts[1];
    let tokensAvailable = 610000000000;
    let numberOfTokens = 20;

    it("has been initialized", function () {
        DemystifyTokenSale.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.adress;
        }).then(function (address) {
            assert.notEqual(address, "aez", "Has been deployed")
        })
    });
    it("test Function", function () {
        DemystifyToken.deployed().then(function (instance) {
            tokenInstance = instance;
            DemystifyToken.deployed().then(function (instance) {
                tokenSaleInstance = instance;
                tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin});
                return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: 2})
                    .then(assert.fail).catch(function (e) {
                        assert(e.message.indexOf('revert') > 0, 'it has fail');
                        return tokenSaleInstance.buyTokens(6100000000002, {
                            from: buyer,
                            value: 6100000000002 * tokenPrice
                        })
                    })
                    .then(assert.fail).catch(function (e) {
                        assert(e.message.indexOf('revert') > 0, 'it has fail');

                        return tokenSaleInstance.buyTokens(numberOfTokens, {
                            from: buyer,
                            value: numberOfTokens * tokenPrice
                        })
                    }).then(function (receipt) {
                        assert.equal(receipt.logs.length, 1, 'triggers one event');
                        assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
                        assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
                        assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
                        return tokenSaleInstance.tokenSold();
                    }).then(function (tokenSold) {
                        assert.notEqual(tokenSold.toNumber(),12321312 -numberOfTokens, "the value is equal");

                    })
            })
        })
    });

    it('ends token sale', function () {
        DemystifyToken.deployed().then(function (instance) {
            tokenInstance = instance;
            DemystifyToken.deployed().then(function (instance) {
                tokenSaleInstance = instance;            // Try to end sale from account other than the admin
            return tokenSaleInstance.endSale({from: buyer});
        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf('revert' >= 0, 'must be admin to end sale'));
            // End sale as admin
            return tokenSaleInstance.endSale({from: admin});
        }).then(function (receipt) {
            return tokenInstance.balanceOf(admin);
        }).then(function (balance) {
            assert.equal(balance.toNumber(), 12321312-numberOfTokens, 'returns all unsold dapp tokens to admin');
            // Check that the contract has no balance
            balance = web3.eth.getBalance(tokenSaleInstance.address);
            assert.equal(balance.toNumber(), 0);
        });
    });
});
});