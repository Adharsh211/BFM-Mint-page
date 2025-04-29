const CONTRACT_ADDRESS = "0x0bd9F5B39F6e90dF3B70458fB6a2C4a2Ba32271d";

const ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      }
    ],
    "name": "mintNFTs",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

let provider;
let signer;
let contract;

document.getElementById("connectButton").addEventListener("click", async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    document.getElementById("status").innerText = "✅ Wallet connected!";
  } else {
    alert("Please install MetaMask!");
  }
});

document.getElementById("mintButton").addEventListener("click", async () => {
  if (!signer || !contract) {
    alert("Connect your wallet first!");
    return;
  }

  const quantity = parseInt(document.getElementById("mintAmount").value);
  if (quantity < 1 || quantity > 10) {
    alert("Quantity must be between 1 and 10");
    return;
  }

  const totalCost = ethers.utils.parseEther((0.01 * quantity).toString());

  try {
    const tx = await contract.mintNFTs(quantity, { value: totalCost });
    document.getElementById("status").innerText = "⏳ Minting in progress...";
    await tx.wait();
    document.getElementById("status").innerText = `✅ Minted ${quantity} NFT(s) successfully!`;
  } catch (err) {
    document.getElementById("status").innerText = `❌ Mint failed: ${err.reason || err.message}`;
  }
});
