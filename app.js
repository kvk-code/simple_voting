document.addEventListener("DOMContentLoaded", () => {
    // Check if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use the browser's ethereum provider
        web3 = new Web3(web3.currentProvider);
    } else {
        alert('Please install MetaMask or another Ethereum wallet.');
        return;
    }

    const contractAddress = '0xe7ce98f5699b51a4d248416e05d4533e0aa9f639'; // Replace with your contract address
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

    document.getElementById("voteForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const candidateName = document.getElementById("candidateName").value;

        try {
            const accounts = await web3.eth.getAccounts();
            await simpleVotingContract.methods.vote(candidateName).send({ from: accounts[0] });
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
