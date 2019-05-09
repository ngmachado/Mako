const MakoToken = artifacts.require("Mako");

contract("MAKO - ERC-20 Tests", async accounts => {
    
    const owner = accounts[0];
    const name = "Mako";
    const symbol = "MAKO";
    const decimals = 18;
    const gasUnits = 23000;
   
    const mintedAmounAmount = ((20000000000 * gasUnits) / 2);

    let ProxyPayment = async function(_target, _sender, _value) {
        return await mako.proxyPayment(_target,{from: _sender, value:  _value});
    }
    

    beforeEach('setup contract test', async function () {
      mako = await MakoToken.new({from: owner})
    });

    it("should deploy the correct parameters", async () => {
        
        let _owner = await mako.owner();
        let _name = await mako.name();
        let _symbol = await mako.symbol();
        let _decimals = await mako.decimals();
        let _gasUnits = await mako.gasUnits();

        assert.equal(_owner, owner, 'should be the same owner');
        assert.equal(_name, name, 'should be the same name');
        assert.equal(_symbol, symbol, 'should be the same symbol');
        assert.equal(_decimals, decimals, 'should be the same decimals');
        assert.equal(_gasUnits, gasUnits, 'should be the same gasUnits');
    });

    it("should change owner", async () => {
        let newOwner = accounts[1];
        let isOwner = (await mako.owner() == newOwner);
        
        assert.isNotOk(isOwner, "should be a diferent owner initial") ;
        await mako.changeOwner(newOwner, {from: owner});
        
        isOwner = (await mako.owner() == newOwner);
        assert.isOk(isOwner, "should be a diferent owner");
    });

    it("should change GasUnits", async () => {
        const newGasUnits = 21000;
        await mako.setGasUnits(newGasUnits, {from: owner});
        let _gasUnits = await mako.gasUnits();
        assert(_gasUnits,newGasUnits, "should be a diferent gasUnits");
    });

    it("should mint the correct amount", async () => {
        let initialBalance = await mako.balanceOf(accounts[1]);
        ProxyPayment(accounts[3],accounts[1],10);
        let finalBalance = await mako.balanceOf(accounts[1]);

        assert.equal(Number(finalBalance),Number(initialBalance) + Number(mintedAmounAmount), "wrong minted tokens");
    });


    it("should bypass payments", async () => {
        let initialBalanceSender = await web3.eth.getBalance(accounts[1]);
        let initialBalanceReceiver = await web3.eth.getBalance(accounts[2]);
        var amount = web3.utils.toWei("1", "ether");
        await ProxyPayment(accounts[2], accounts[1], amount);
        
        let finalBalanceSender = await web3.eth.getBalance(accounts[1]);
        let finalBalanceReceiver = await web3.eth.getBalance(accounts[2]);
        
        assert.equal(Number(initialBalanceReceiver) + Number(amount),  Number(finalBalanceReceiver), "should have credit the sender  account");
        assert.isOk(Number(initialBalanceSender) > Number(finalBalanceSender), "should have debit the sender account");

    });
});

