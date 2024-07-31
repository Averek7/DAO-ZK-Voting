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
    const proposalTitle = "Test Proposal #1";
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
});
