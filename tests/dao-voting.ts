import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DaoVotingProgram } from "../target/types/dao_voting_program";
import { assert } from "chai";

describe("dao_voting_program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.DaoVotingProgram as Program<DaoVotingProgram>;
  const proposalTitle = "Test Proposal";
  const proposalDescription = "This is a test proposal.";
  let proposalAccount = anchor.web3.Keypair.generate();
  let creatorAccount = anchor.web3.Keypair.generate();

  it("Create a proposal", async () => {
    // Airdrop SOL to creator account for transaction fees
    const provider = anchor.AnchorProvider.env();
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(creatorAccount.publicKey, 1_000_000_000) // 1 SOL
    );

    await program.rpc.createProposal(
      proposalTitle,
      proposalDescription,
      {
        accounts: {
          proposal: proposalAccount.publicKey,
          user: creatorAccount.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [proposalAccount, creatorAccount],
        instructions: [
          await program.account.proposal.createInstruction(proposalAccount),
        ],
      }
    );

    const proposal = await program.account.proposal.fetch(proposalAccount.publicKey);
    assert.equal(proposal.title, proposalTitle);
    assert.equal(proposal.description, proposalDescription);
  });
});
