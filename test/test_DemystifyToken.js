let DemystifyToken = artifacts.require("DemystifyToken");

contract('DemystifyToken', function (accounts) {
    let tokenInstance;
    let totalToken = 1000000;
    it('Function Name', function () {
        DemystifyToken.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function (name) {
            assert.equal(name, 'Chohra Token', 'the name is Setted');
            return tokenInstance.symbol();
        }).then(function (symbol) {
            assert.equal(symbol, 'CH', 'the Symbol is Equal');
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
            assert.equal(totalSupply.toNumber(), totalToken, 'set the total number');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function (adminBalance) {
            assert.equal(adminBalance.toNumber(), totalToken, 'it is equal');
        })
    });
    it('Test Transfert ', function () {
        return DemystifyToken.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 13312332122123);
        }).then(assert.fail)
            .catch(function (e) {
                assert(e.message.indexOf('revert') >= 0, 'error');
                return tokenInstance.transfer.call(accounts[1], 2);
            }).then(function (success) {
                assert.equal(success, 1, 'Vall Works');

                return tokenInstance.transfer(accounts[1], 20, {from: accounts[0]});

            }).then(function (receipt) {
                assert.equal(receipt.logs.length, 1, 'only One call');
                assert.equal(receipt.logs[0].event, 'Transfer', 'The transfer event');
                assert.equal(receipt.logs[0].args._from, accounts[0], 'First Account ');
                assert.equal(receipt.logs[0].args._to, accounts[1], 'Second Account');
                assert.equal(receipt.logs[0].args._value, 20, 'Value');
                return tokenInstance.balanceOf(accounts[1]);

            }).then(function (balance) {
                assert.equal(balance.toNumber(), 20, 'has been transformed');
                return tokenInstance.balanceOf(accounts[0]);
            }).then(function (balance) {
                assert.equal(balance.toNumber(), totalToken - 20, 'has been transformed');
            })
    });
    it('approve Token', function () {
        let tokenInstance;
        return DemystifyToken.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 20);
        }).then(function (result) {
            assert.equal(result, true, 'the result is true');
            return tokenInstance.approve(accounts[1], 20, {
                from: accounts[0]
            });
        }).then(function (receipt) {
            assert.equal(receipt.logs.length, 1, 'only One call');
            assert.equal(receipt.logs[0].event, 'Approval', 'The transfer event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'First Account ');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'Second Account');
            assert.equal(receipt.logs[0].args._value, 20, 'Value');
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function (allowance) {
            assert.equal(allowance.toNumber(), 20, 'Allowance passed');
        })
    });

    it('handles delegated token transfers', function () {
        return DemystifyToken.deployed().then(function (instance) {
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            // Transfer some tokens to fromAccount
            return tokenInstance.transfer(fromAccount, 100, {from: accounts[0]});
        }).then(function (receipt) {
            // Approve spendingAccount to spend 10 tokens form fromAccount
            return tokenInstance.approve(spendingAccount, 10, {from: fromAccount});
        }).then(function (receipt) {
            // Try transferring something larger than the sender's balance
            return tokenInstance.transferFrom(fromAccount, toAccount, 9999, {from: spendingAccount});
        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
            // Try transferring something larger than the approved amount
            return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount});
        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount});
        }).then(function (success) {
            assert.equal(success, true);
            return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});
        }).then(function (receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
            return tokenInstance.balanceOf(fromAccount);
        }).then(function (balance) {
            assert.equal(balance.toNumber(), 90, 'deducts the amount from the sending account');
            return tokenInstance.balanceOf(toAccount);
        }).then(function (balance) {
            assert.equal(balance.toNumber(), 10, 'adds the amount from the receiving account');
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(function (allowance) {
            assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
        });
    });
});