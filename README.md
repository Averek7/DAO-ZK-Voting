# DAO Voting Program

This is a DAO voting program built using Anchor. The program allows users to create proposals, vote on them, and reward participation using reward points. Optionally, privacy voting can be implemented using Zero-Knowledge (ZK) proofs or verifiable compute.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
  - [Create a Proposal](#create-a-proposal)
  - [Vote on a Proposal](#vote-on-a-proposal)
  - [Reward Participation](#reward-participation)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This program is a decentralized autonomous organization (DAO) voting system built on the Solana blockchain using the Anchor framework. Users can create proposals, vote on them, and receive reward points for their participation.

## Installation

To install the required dependencies, run the following commands:

```bash
# Clone the repository
git clone https://github.com/yourusername/dao-voting.git

# Change to the project directory
cd dao-voting

# Install the necessary dependencies
anchor build
anchor deploy
```
## Usage

# Create a Proposal
To create a proposal, use the create_proposal instruction. You need to provide a title and description for the proposal.

```bash
pub fn create_proposal(
    ctx: Context<CreateProposal>,
    title: String,
    description: String,
) -> Result<()> {
    create_proposal_handler(ctx, title, description)
}
```

## Vote on a Proposal
To vote on a proposal, use the vote instruction. You need to provide the proposal title and your vote (true for yes, false for no).

```bash
pub fn vote(ctx: Context<Vote>, title: String, vote: bool) -> Result<()> {
    vote_handler(ctx, title, vote)
}
```

## Reward Participation
To reward participation, use the reward_participation instruction. You need to provide the public key of the voter.

```bash
pub fn reward_participation(
    ctx: Context<RewardParticipation>,
    voter_pubkey: Pubkey,
) -> Result<()> {
    reward_participation_handler(ctx, voter_pubkey)
}
```

## Testing
To run the tests, use the following command:

```bash
anchor test
```
