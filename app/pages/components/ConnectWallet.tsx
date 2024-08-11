import React from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { obfuscatePubKey } from "@/context/transactions";
import { useWallet } from "@solana/wallet-adapter-react";

function ConnectWallet() {
  let wallet = useWallet();
  const walletModal = useWalletModal();
  async function logout() {
    try {
      await wallet.disconnect();
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (!wallet.publicKey || wallet.connecting) {
            walletModal.setVisible(true);
          } else logout();
        }}
        className="font-inter hidden sm:w-fit sm:flex text-white bg-[#182635] hover:bg-[#121D28] transition-all font-semibold rounded-md text-sm px-5 py-3"
      >
        {wallet.connecting ? (
            "Connecting..."
        ) : wallet.publicKey ? (
          obfuscatePubKey(wallet.publicKey.toBase58())
        ) : (
          <span className="connect-wallet">
            Connect Wallet
          </span>
        )}
      </button>
    </div>
  );
}

export default ConnectWallet;
