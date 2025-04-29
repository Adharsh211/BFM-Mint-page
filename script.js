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

let signer;

async function connectWallet() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    alert("✅ Wallet Connected!");
  } else {
    alert("❌ Please install MetaMask to continue.");
  }
}

async function mintNFT() {
  if (!signer) return alert("❗ Connect wallet first!");

  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  const quantity = parseInt(document.getElementById("mintAmount").value);

  if (isNaN(quantity) || quantity < 1 || quantity > 10) {
    return alert("❗ Please enter a valid mint amount between 1 and 10");
  }

  const pricePerNFT = "0.01";
  const totalPrice = ethers.utils.parseEther((quantity * parseFloat(pricePerNFT)).toString());

  try {
    const tx = await contract.mintNFTs(quantity, { value: totalPrice });
    document.getElementById("status").innerText = "Minting in progress...";
    await tx.wait();
    document.getElementById("status").innerText = `✅ Successfully minted ${quantity} NFT(s)!`;
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Minting failed: " + (err.reason || err.message);
  }
} 
