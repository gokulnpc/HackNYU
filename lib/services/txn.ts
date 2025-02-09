import { Connection, PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider, Idl, BN } from "@project-serum/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import idl from "./txnidl.json";

const SOLANA_RPC = "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey(
  "CMFELLS54Crf95jwUhr2Ez6RDjZQiKt2SsfZxxJCCqKu"
);

class SolanaService {
  private connection: Connection;
  private provider: AnchorProvider;
  private program: Program;

  constructor(wallet: WalletContextState) {
    if (
      !wallet.publicKey ||
      !wallet.signTransaction ||
      !wallet.signAllTransactions
    ) {
      throw new Error("❌ Wallet not connected properly");
    }
    console.log("✅ Wallet connected:", wallet.publicKey.toBase58());

    this.connection = new Connection(SOLANA_RPC, "confirmed");
    const anchorWallet = {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
    };
    this.provider = new AnchorProvider(this.connection, anchorWallet, {
      preflightCommitment: "confirmed",
    });
    this.program = new Program(idl as Idl, PROGRAM_ID, this.provider);
  }

  async sendTxn({
    data,
    owner,
  }: {
    data: number;
    owner: PublicKey;
  }): Promise<string> {
    try {
      console.log("🚀 Sending transaction with data:", data);
      const assetMetadataKeypair = Keypair.generate();
      console.log(
        "🔑 Generated Metadata Keypair:",
        assetMetadataKeypair.publicKey.toBase58()
      );

      const tx = await this.program.methods
        .initialize(new BN(data))
        .accounts({
          newAccount: assetMetadataKeypair.publicKey,
          signer: owner,
          systemProgram: SystemProgram.programId,
        })
        .signers([assetMetadataKeypair])
        .rpc();

      console.log("✅ Transaction Signature:", tx);
      return tx;
    } catch (error) {
      console.error("❌ Error creating asset:", error);
      throw error;
    }
  }
}

export function getTransactionService(
  wallet: WalletContextState
): SolanaService {
  return new SolanaService(wallet);
}

export default SolanaService;
