pragma solidity ^0.5.4;

contract SBallottaggio {

    struct Voter {
        uint weight; // weight is accumulated by delegation
        bool voted;  // if true, that person already voted
        uint vote;   // index of the voted proposal
    }

    // This is a type for a single proposal.
    struct Proposal {
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    address public chairperson;

    string public title;
    
    bool public isOpen;

    mapping(address => Voter) public voters;

    Proposal[] public proposals;

    constructor(string memory _title, bytes32[] memory proposalNames) public {
        title = _title;
        chairperson = msg.sender;
        voters[chairperson].weight = 1;
        isOpen = true;

        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    function giveRightToVote(address voter) public {

        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(
            !voters[voter].voted,
            "The voter already voted."
        );
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;
    }
    
    function closeVotation() public {
        require(
            msg.sender == chairperson,
            "Only chairperson can close votation."
        );
        isOpen = false;
    }

    function vote(uint proposal) public {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        require(isOpen, "Votation closed");
        sender.voted = true;
        sender.vote = proposal;

        proposals[proposal].voteCount += sender.weight;
    }

    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() public view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
    
    function winnerVotes() public view returns (uint count_) {
      count_ = proposals[winningProposal()].voteCount;
    }
    
    function totProposals() public view returns (uint count_) {
      count_ = proposals.length;
    }
    
}