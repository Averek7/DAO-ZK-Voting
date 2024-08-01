import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DaoVoting } from "../target/types/dao_voting";
import { assert } from "chai";

describe("dao_voting", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.DaoVoting as Program<DaoVoting>;

  it("Create a proposal", async () => {
    const proposalTitle = "Test Proposal";
    const proposalDescription = "This is a test proposal #1.";
    let [proposalAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(proposalTitle)],
      program.programId
    );

    await program.methods
      .createProposal(proposalTitle, proposalDescription)
      .accounts({
        proposal: proposalAccount,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([])
      .rpc();

    const proposal = await program.account.proposal.fetch(proposalAccount);
    assert.equal(proposal.title, proposalTitle);
    assert.equal(proposal.description, proposalDescription);
  });

  it("Cast vote", async () => {
    const proposalTitle = "Test Proposal";

    let [proposalAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(proposalTitle)],
      program.programId
    );

    let voterAccount = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(proposalTitle), provider.wallet.publicKey.toBuffer()],
      program.programId
    )[0];

    await program.methods
      .vote(proposalTitle, true)
      .accounts({
        proposal: proposalAccount,
        userVote: voterAccount,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([])
      .rpc();

    const voter = await program.account.userVote.fetch(voterAccount);
    console.log("Voter : ", voter);
  });

  it("Participation Reward", async () => {
    let voterAccount = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("voter_account"), provider.wallet.publicKey.toBuffer()],
      program.programId
    )[0];

    await program.methods
      .rewardParticipation(provider.wallet.publicKey)
      .accounts({
        voter: voterAccount,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([])
      .rpc();

    const voter = await program.account.voter.fetch(voterAccount);

    assert.ok(voter.rewardPoints);
    assert.ok(voter.pubkey);
  });
});
