const CONTRACT_ADDRESS = "0x0bd9F5B39F6e90dF3B70458fB6a2C4a2Ba32271d"; // Example: 0x8FcA78...

const ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "prerevealURI",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "safeMint",
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
    alert("Wallet Connected!");
  } else {
    alert("Please install MetaMask to continue.");
  }
}

async function mintNFT() {
  if (!signer) return alert("Connect wallet first!");

  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  
  try {
    const tx = await contract.safeMint(await signer.getAddress(), {
      value: ethers.utils.parseEther("0.01") // Set to "0" if free mint
    });
    await tx.wait();
    alert("NFT Minted Successfully!");
  } catch (err) {
    alert("Minting Failed: " + err.message);
  }
}