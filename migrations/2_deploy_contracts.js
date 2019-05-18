const Mako = artifacts.require('Mako');
const MockEngine = artifacts.require('MockEngine');

module.exports = function(deployer, network, accounts) {
    if(network == 'ganache' || network == 'develop') {
        deployer.deploy(MockEngine).then(function() {
            return deployer.deploy(Mako, MockEngine.address);
        });
    } else {
        deployer.deploy(Mako, accounts[8]);
    }
};
