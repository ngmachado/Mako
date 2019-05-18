const MockEngine = artifacts.require("MockEngine");
const MakoToken = artifacts.require("Mako");

var BN = require("bignumber.js");

contract("MAKO - ERC-20 Tests", async accounts => {
    
    const owner = accounts[0];
    const name = "Mako";
    const symbol = "MAKO";
    const decimals = 18;
    const gasUnits = 23000;
    const txGasPrice = 20000000000;
   
    const mintedAmounAmount = ((20000000000 * gasUnits) / 2);

    let ProxyPayment = async function(_target, _sender, _value) {
        return await mako.proxyPayment(_target,{from: _sender, value:  _value});
    }

    let TokenGenarator = async function(_target, sender, loopCount, _gasUnits) {
        //change gasUnits to generate more tokens per tx
        await mako.setGasUnits(_gasUnits);
        
        for(i=0; i < loopCount; i++) {
               await ProxyPayment(_target,sender,1);
        }

        await mako.setGasUnits(gasUnits);
        let _gasPrice = new BN(txGasPrice).multipliedBy(_gasUnits);
        let _generated = _gasPrice.dividedBy(2).multipliedBy(loopCount);
        return _generated;
    } 
    

    beforeEach('setup contract test', async function () {
        mako = await MakoToken.new(MockEngine.address, {from: owner})
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
        let initialBalance = new BN(await mako.balanceOf(accounts[1]));
        ProxyPayment(accounts[3], accounts[1], 10);
        let finalBalance = new BN(await mako.balanceOf(accounts[1]));

        assert.equal(finalBalance.valueOf(), initialBalance.plus(mintedAmounAmount).valueOf(), "wrong minted tokens");
    });


    it("should bypass payments", async () => {
        let initialBalanceSender = new BN(await web3.eth.getBalance(accounts[1]));
        let initialBalanceReceiver = new BN(await web3.eth.getBalance(accounts[2]));
        var amount = web3.utils.toWei("1", "ether");
        await ProxyPayment(accounts[2], accounts[1], amount);
        
        let finalBalanceSender = new BN(await web3.eth.getBalance(accounts[1]));
        let finalBalanceReceiver = new BN(await web3.eth.getBalance(accounts[2]));
        
        assert.equal(initialBalanceReceiver.plus(amount).valueOf(), finalBalanceReceiver.valueOf(), "should have credit the sender  account");
        assert.isOk(initialBalanceSender.valueOf() > finalBalanceSender.valueOf(), "should have debit the sender account");

    });


    it("should generate tokens in the correct amount", async () => {
        var newTokens = new BN(mintedAmounAmount).multipliedBy(3);
        let nTokensGenerated = await TokenGenarator(accounts[2], accounts[1], 3, gasUnits);

        assert.equal(nTokensGenerated.valueOf(), newTokens.valueOf(), "should have generated the correct amount of new tokens");
        assert.equal(nTokensGenerated.valueOf(), new BN(await mako.balanceOf(accounts[1])), "should have added the correct amount to account");
        assert.equal(nTokensGenerated.valueOf(), new BN(await mako.totalSupply()), "should have added the correct amount to totalSupply");

    })


    it("should send the correct amount of tokens", async () => {
        let nTokensGenerated = await TokenGenarator(accounts[2], accounts[1], 3, new BN(99999999));
        
        let initialBalanceSender = new BN(await mako.balanceOf(accounts[1]));
        let initialBalanceReceiver = new BN(await mako.balanceOf(accounts[2]));
        
        await mako.transfer(accounts[2], 5000, {from: accounts[1]});

        let finalBalanceSender = new BN(await mako.balanceOf(accounts[1]));
        let finalBalanceReceiver = new BN(await mako.balanceOf(accounts[2]));

        assert.equal(initialBalanceSender.minus(5000).valueOf(),finalBalanceSender.valueOf(), "should have debit sender account");
        assert.equal(initialBalanceReceiver.plus(5000).valueOf(), finalBalanceReceiver.valueOf(),"should have credit receiver account");

    });

    it("should approve tokens", async () => {
        var approver = accounts[5];
        var approved = accounts[4];

        await mako.approve(approved, 1000, {from: approver});
        let amountAllowed = await mako.allowance(approver, approved);

        assert.equal(amountAllowed.valueOf(), 1000, "should have approved tokens to spender");
    });

    it('should transfer allowance tokens', async () => {
        //fund operation
        await TokenGenarator(accounts[7], accounts[5],1,gasUnits);
        
        let initialBalanceApprover = new BN(await mako.balanceOf(accounts[5]));
        let initialBalanceSender = new BN(await mako.balanceOf(accounts[1]));
        let initialBalanceReceiver = new BN(await mako.balanceOf(accounts[6]));

        await mako.approve(accounts[1], 1000, {from:accounts[5]});
        await mako.transferFrom(accounts[5], accounts[6], 1000, {from: accounts[1]});

        let finalBalanceApprover = new BN(await mako.balanceOf(accounts[5]));
        let finalBalanceSender = new BN(await mako.balanceOf(accounts[1]));
        let finalBalanceReceiver = new BN(await mako.balanceOf(accounts[6]));

        assert.equal(initialBalanceApprover.minus(1000).valueOf(), finalBalanceApprover.valueOf() ,"should have debit approver account");
        assert.equal(initialBalanceSender.valueOf(), finalBalanceSender.valueOf(),"shout not have change sender account");
        assert.equal(initialBalanceReceiver.plus(1000).valueOf(), finalBalanceReceiver.valueOf(), "should have credit receiver account");
    });

    it("should burn some tokens", async () => {
        //fund operation
        await TokenGenarator(accounts[7], accounts[5],1,gasUnits);
        
        let initialBalanceBurner = new BN(await mako.balanceOf(accounts[5]));
        await mako.burn(1000, {from : accounts[5]});
        let finalBalanceBurner = new BN(await mako.balanceOf(accounts[5]));

        assert.equal(initialBalanceBurner.minus(1000).valueOf(), finalBalanceBurner.valueOf())
    });
});

