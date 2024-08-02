import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DaoVoting } from "../target/types/dao_voting";
import { assert } from "chai";

const generateMockZKProofAndInput = () => {
  // Replace with real proof generation logic
  const zkProof = Buffer.from(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));
  const publicInput =
    "0000000000000000000000000000000000000000000000000000000000000000";
  return { zkProof, publicInput };
};

describe("dao_voting", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.DaoVoting as Program<DaoVoting>;

  it("Create a proposal", async () => {
    const proposalTitle = "Test is on";
    const proposalDescription = "This is a test proposal";
    let [proposalAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(proposalTitle)],
      program.programId
    );

    let [verifyAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("verifyKey"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .createProposal(proposalTitle, proposalDescription)
      .accounts({
        proposal: proposalAccount,
        verifyingKey: verifyAccount,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([])
      .rpc();

    const proposal = await program.account.proposal.fetch(proposalAccount);
    assert.equal(proposal.title, proposalTitle);
    assert.equal(proposal.description, proposalDescription);
  });

  // it("Cast vote", async () => {
  //   const proposalTitle = "New Test Proposal";

  //   let [proposalAccount] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from(proposalTitle)],
  //     program.programId
  //   );

  //   let [voterAccount] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from(proposalTitle), provider.wallet.publicKey.toBuffer()],
  //     program.programId
  //   );

  //   await program.methods
  //     .vote(proposalTitle, false)
  //     .accounts({
  //       proposal: proposalAccount,
  //       userVote: voterAccount,
  //       user: provider.wallet.publicKey,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     })
  //     .signers([])
  //     .rpc();

  //   const voter = await program.account.userVote.fetch(voterAccount);
  //   assert.ok(voter.voted, "false");
  //   assert.ok(voter.proposalTitle, proposalTitle);
  // });

  it("Participation Reward", async () => {
    let [voterAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("voter_account"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

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

  it("Cast vote with ZK proof", async () => {
    const proposalTitle = "Test is on";

    let [proposalAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(proposalTitle)],
      program.programId
    );

    let [userVoteAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(proposalTitle), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    let [verifyAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("verifyKey"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    const { zkProof, publicInput } = generateMockZKProofAndInput();

    await program.methods
      .vote(proposalTitle, true, zkProof, publicInput.toString())
      .accounts({
        proposal: proposalAccount,
        userVote: userVoteAccount,
        verifyingKey: verifyAccount,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([])
      .rpc();

    const proposal = await program.account.proposal.fetch(proposalAccount);
    assert.equal(proposal.yesVotes.toNumber(), 1);

    const userVote = await program.account.userVote.fetch(userVoteAccount);
    assert.equal(userVote.voted, true);
    assert.equal(
      userVote.voter.toString(),
      provider.wallet.publicKey.toString()
    );
    assert.equal(userVote.proposalTitle, proposalTitle);
  });
});
