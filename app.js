document.addEventListener("DOMContentLoaded", () => {
    let web3;
    let userAccount;

    // Check if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.ethereum !== 'undefined') {
        // Use the browser's ethereum provider
        web3 = new Web3(window.ethereum);
    } else {
        alert('Please install MetaMask or another Ethereum wallet.');
        return;
    }

    const contractAddress = '0xe7cE98f5699b51A4d248416E05d4533e0AA9f639'; // Your contract address
    const contractABI = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "candidate",
                    "type": "string"
                }
            ],
            "name": "vote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "candidate",
                    "type": "string"
                }
            ],
            "name": "viewVotes",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "votes",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    const simpleVotingContract = new web3.eth.Contract(contractABI, contractAddress);

    // Connect to MetaMask
    document.getElementById("connectWalletButton").addEventListener("click", async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            document.getElementById("walletAddress").innerText = `Connected: ${userAccount}`;
        } catch (error) {
            console.error(error);
            alert('There was an error connecting to MetaMask.');
        }
    });

    document.getElementById("voteForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const candidateName = document.getElementById("candidateName").value;

        if (!userAccount) {
            alert('Please connect your wallet first.');
            return;
        }

        try {
            await simpleVotingContract.methods.vote(candidateName).send({ from: userAccount });
            alert(`Vote casted for ${candidateName}!`);
        } catch (error) {
            console.error(error);
            alert('There was an error casting your vote.');
        }
    });

    document.getElementById("viewVotesForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const viewCandidateName = document.getElementById("viewCandidateName").value;

        try {
            const voteCount = await simpleVotingContract.methods.viewVotes(viewCandidateName).call();
            document.getElementById("voteCountResult").innerText = `${viewCandidateName} has ${voteCount} votes.`;
        } catch (error) {
            console.error(error);
            alert('There was an error retrieving the vote count.');
        }
    });
});
