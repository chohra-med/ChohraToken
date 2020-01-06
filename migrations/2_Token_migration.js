
const DemystifyToken = artifacts.require("DemystifyToken");

module.exports = function(deployer) {
    deployer.deploy(DemystifyToken);
};
