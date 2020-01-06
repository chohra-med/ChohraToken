let DemystifyToken = artifacts.require("DemystifyToken");

contract('DemystifyToken', function (accounts) {

    it('set the total supplyToken ', function () {
        return DemystifyToken.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function (totalSupply) {
            assert.equal(totalSupply.toNumber(), 123213, 'set the total number');
        })
    })
})