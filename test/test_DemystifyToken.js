let DemystifyToken = artifacts.require("DemystifyToken");

contract('DemystifyToken', function (accounts) {
    let tokenInstance;

    it('Function Name', function () {
        DemystifyToken.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function (name) {
            assert.equal(name, 'name', 'the name is Setted');
            return tokenInstance.symbol();
        }).then(function (symbol) {
            assert.equal(symbol, 'dem', 'the Symbol is Equal');
            return tokenInstance.standard();
        }).then(function (standard) {
            assert.equal(standard, 'Token v0.1', 'the Symbol is Equal');
        })
    });
    it('set the total supplyToken ', function () {
        return DemystifyToken.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function (totalSupply) {
            assert.equal(totalSupply.toNumber(), 123213, 'set the total number');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function (adminBalance) {
            assert.equal(adminBalance.toNumber(), 123213, 'it is equal');
        })
    });
    it('Test Transfert ', function () {
        return DemystifyToken.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 13322123);
        }).then(assert.fail)
            .catch(function (e) {
                assert(e.message.indexOf('revert') >= 0, 'error');
                return tokenInstance.transfer.call(accounts[1], 2);
            }).then(function (success) {
                assert.equal(success, 1, 'Vall Works');

                return tokenInstance.transfer(accounts[1], 20, {from: accounts[0]});

            }).then(function (receipt) {
                assert.equal(receipt.logs.length, 1, 'only Onye Evenet');
                assert.equal(receipt.logs[0].event, 'Transfer', 'only Onye Evenet');
                assert.equal(receipt.logs[0].args._from, accounts[0], 'First Account ');
                assert.equal(receipt.logs[0].args._to, accounts[1], 'Second Account');
                assert.equal(receipt.logs[0].args._value, 20, 'Value');
                return tokenInstance.balanceOf(accounts[1]);

            }).then(function (balance) {
                assert.equal(balance.toNumber(), 20, 'has been transformed');
                return tokenInstance.balanceOf(accounts[0]);
            }).then(function (balance) {
                assert.equal(balance.toNumber(), 123213 - 20, 'has been transformed');
            })
    });
});