import React, { useState } from "react";
import { createProposal, castVote } from "@/context/transactions";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useGlobalContext } from "./GlobalContext";

const Create: React.FC = () => {
  const wallet = useAnchorWallet();
  const { title, setTitle, description, setDescription } = useGlobalContext();

  const handleCreateProposal = async () => {
    if (!wallet || !wallet.publicKey) {
      console.error("Wallet not connected or public key missing");
      return;
    }

    try {
      const txId = await createProposal(title, description, wallet);
      console.log("Proposal created successfully with transaction ID:", txId);
    } catch (error) {
      console.error("Error creating proposal:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">DAO Voting</h1>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Create Proposal</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleCreateProposal}
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Create Proposal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create;
