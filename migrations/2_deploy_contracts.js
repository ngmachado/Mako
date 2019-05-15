const Mako = artifacts.require('Mako');

module.exports = function(deployer, network, accounts) {
      deployer.deploy(Mako, accounts[8]);
};
