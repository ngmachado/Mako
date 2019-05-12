### WIP

# Mako is the energy for modern world!

#### We transform Mako liquid in electricity, so we can live a good modern life!

_Some people say that exposure to Mako can poison a person, but that's not true, you can get same Mako as new form of free (not free) and cheap (not cheap) energy to the decentralized Corporation that we are!_

---
### How can you collect some Mako?

The idea is very simple, you use the contract [contract] to bypass your Ethereum payments.

### What do you mean by "bypass"? It's safe?

You can review the contract and the methods in question.
Bypassing is using this contract to make a proxy payment. You send the ether and a target address, the script will take the sended ether and transfer to the target address.

---

```javascript

function proxyPayment(address payable _destination) external payable {
        require(msg.value > 0, 'Payments proxy only');
        
        uint256 amount = _mintAmount();
        _destination.transfer(msg.value);
        _mint(msg.sender, amount);
        
        emit PaymentProxy(msg.sender, _destination, msg.value, amount);
}

```

---

### There's a fee?

No. The only fee is the extra gas you have to pay and by the way, minted mako is half of that extra gas ;)

### Is important the amount of sended ether?

No, you can bypass 1wei, the generated Mako will be the same, always 1/2 of the gas cost.

---

```javascript

function _mintAmount() internal view returns (uint256) {
       return (tx.gasprice * gasUnits / 2);
}

```

---

### Wait, this is only a normal ERC-20

Yes! You are right.

### Where is the contract?

[Mako in Ropsten](https://ropsten.etherscan.io/address/0x85965fc432f8366d6a6be2c0fea04ece27e48d0e "Mako")

### Please by aware this is a learning project, don't trust the code, review it!
