import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { createProposal } from "@/context/transactions";
import Create from "./components/Create";
import ConnectWallet from "./components/ConnectWallet";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const wallet = useAnchorWallet();

  const [proposals, setProposals] = useState([]);
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");

  const handleCreateProposal = async () => {
    if (!wallet) {
      console.error("Wallet not connected");
      return;
    }

    try {
      await createProposal(proposalTitle, proposalDescription, wallet);
      console.log("Proposal created successfully");
    } catch (error) {
      console.error("Error creating proposal:", error);
    }
  };

  useEffect(() => {
    const fetchProposals = async () => {};
    fetchProposals();
  }, []);
  return (
    <div className={``}>
      <ConnectWallet />

      <div>
        <h1>DAO Voting System</h1>
        <ul>
          {/* {proposals.map((proposal, index) => (
            <li key={index}>{proposal.title}</li>
          ))} */}
        </ul>
      </div>

      <Create />
    </div>
  );
}
