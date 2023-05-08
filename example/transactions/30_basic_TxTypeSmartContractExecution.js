const ethers = require("ethers");
const { KlaytnWallet } = require("../../dist/src/ethers"); // require("@klaytn/sdk-ethers");

const fs = require('fs')
const privateKey1 = fs.readFileSync('./example/privateKey', 'utf8') // private key of sender 

const account1 = '0x3208ca99480f82bfe240ca6bc06110cd12bb6366' // sender address 
const account2 = '0xD7fA6634bDDe0B2A9d491388e2fdeD0fa25D2067' // contract address 

//
// TxTypeSmartContractExecution
// https://docs.klaytn.foundation/content/klaytn/design/transactions/basic#txtypesmartcontractexecution
// 
//   type: Must be 0x30,
//   gasLimit: Must be fixed value, because it calls deprecated old eth_estimateGas API of Klaytn node
//   to : deployed contract address 
//   value: Must be 0, if not payable
//   input: Refer ethers.utils.interface.encodeFunctionData
//          https://docs.ethers.org/v5/api/utils/abi/interface/#Interface--encoding 
//
//          // 1) by using contract object 
//          const CONTRACT_ADDRESS = '0xD7fA6634bDDe0B2A9d491388e2fdeD0fa25D2067';
//          const CONTRACT_ABI = ["function setNumber(uint256 newNumber) public", "function increment() public"];
//          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
//          const param = contract.interface.encodeFunctionData("setNumber", ["0x123"]); 
//
//          // 2) by using utils.interface
//          const CONTRACT_ABI = ["function setNumber(uint256 newNumber) public", "function increment() public"];
//          const iface = new ethers.utils.Interface( CONTRACT_ABI );
//          const param = iface.encodeFunctionData("setNumber", [ "0x123" ])
//
async function main() {
  const provider = new ethers.providers.JsonRpcProvider('https://public-en-baobab.klaytn.net')
  const wallet = new KlaytnWallet(privateKey1, provider);

  const CONTRACT_ADDRESS = account2;
  const CONTRACT_ABI = ["function setNumber(uint256 newNumber) public", "function increment() public"];
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  const param = contract.interface.encodeFunctionData("setNumber", ["0x123"]); 

  tx = {
      type: 0x30,
      gasLimit: 1000000000,  
      to: account2,
      value: 0,  
      from: account1,
      input: param,
    }; 
  
  if (1) {
    // One-shot (recommended)
    const sentTx = await wallet.sendTransaction(tx);
    console.log('sentTx', sentTx);

    const rc = await sentTx.wait();
    console.log('receipt', rc);
  } else {
    // Step-by-step
    popTx = await wallet.populateTransaction(tx);
    console.log('tx', popTx);

    const rawTx = await wallet.signTransaction(popTx);
    console.log('rawTx', rawTx);

    const txhash = await provider.send("klay_sendRawTransaction", [rawTx]);
    console.log('txhash', txhash);

    const rc = await provider.waitForTransaction(txhash);
    console.log('receipt', rc);
  }
}

main();