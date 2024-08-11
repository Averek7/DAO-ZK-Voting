import { AnchorWallet } from "@solana/wallet-adapter-react";
import {
  SystemProgram,
  PublicKey,
  Connection,
  clusterApiUrl,
} from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { IDL, DaoVoting } from "@/context/dao-votingIDL";
import { WalletAdapter } from "@solana/wallet-adapter-base";

export const commitmentLevel = "processed";
export const endpoint = clusterApiUrl("devnet");
export const connection = new Connection(endpoint, commitmentLevel);

export const obfuscatePubKey = (address: string) => {
  return (
    address?.substring(0, 4) + "..." + address?.substring(address.length - 4)
  );
};

export const programInterface = JSON.parse(JSON.stringify(IDL));

function getProgram({ connection, wallet }: any) {
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: commitmentLevel,
  });
  return new Program(programInterface, provider);
}

export const createProposal = async (
  title: string,
  description: string,
  wallet: any
) => {
  const program = getProgram(wallet);

  try {
    const [proposalAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(title)],
      program.programId
    );

    const txn = await program.methods
      .createProposal(title, description)
      .accounts({
        proposal: proposalAccount,
        user: wallet.publicKey!,
        systemProgram: SystemProgram.programId,
      })
      .signers([])
      .rpc();
  } catch (error) {
    console.log("Error creating proposal:", error);
  }
};

export const castVote = async (
  wallet: WalletAdapter,
  title: string,
  vote: boolean
) => {
  const program = getProgram(wallet);
  const [proposalAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(title)],
    program.programId
  );

  const [voterAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(title), Buffer.from(wallet.publicKey?.toBuffer() ?? "")],
    program.programId
  );

  await program.methods
    .vote(title, vote)
    .accounts({
      proposal: proposalAccount,
      userVote: voterAccount,
      user: wallet.publicKey!,
      systemProgram: SystemProgram.programId,
    })
    .signers([])
    .rpc();

  await program.methods
    .rewardParticipation(wallet.publicKey!)
    .accounts({
      voter: voterAccount,
      user: wallet.publicKey!,
      systemProgram: SystemProgram.programId,
    })
    .signers([])
    .rpc();

  return voterAccount;
};
