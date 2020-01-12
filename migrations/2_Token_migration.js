var DemystifyToken = artifacts.require("DemystifyToken");
var DemystifyTokenSale = artifacts.require("DemystifyTokenSale");

module.exports = function(deployer) {
    deployer.deploy(DemystifyToken, 1000000).then(function() {
        // Token price is 0.001 Ether
        var tokenPrice = 1000000000000000;
        var tokensAvailable = 750000;

        return deployer.deploy(DemystifyTokenSale, DemystifyToken.address, tokenPrice);
    });
};


