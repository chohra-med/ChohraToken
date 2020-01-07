const DemystifyToken = artifacts.require("DemystifyToken");
let DemystifyTokenSale = artifacts.require("DemystifyTokenSale");

module.exports = function (deployer) {
    let tokenPrice = 1000000000000000;
    deployer.deploy(DemystifyToken, 123213).then(function () {
        deployer.deploy(DemystifyTokenSale,
            DemystifyToken.address, tokenPrice
        );
    });
};
