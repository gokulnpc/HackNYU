import { Connection, PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider, BN, Idl } from "@project-serum/anchor";
import idl from "./idl.json"; // Ensure this file exists

const PROGRAM_ID = new PublicKey(
  "HJTHhCPBZotdBWftcvSwkLKyGi2C56cUtTDqnjV2RaCZ"
);
const SOLANA_RPC = "https://api.devnet.solana.com"; // Devnet RPC endpoint

class SolanaService {
  private connection: Connection;
  private provider: AnchorProvider;
  private program: Program;

  constructor(wallet: any) {
    if (!wallet) {
      throw new Error("Wallet must be provided");
    }

    this.connection = new Connection(SOLANA_RPC, "confirmed");

    this.provider = new AnchorProvider(this.connection, wallet, {
      preflightCommitment: "confirmed",
    });

    this.program = new Program(idl as Idl, PROGRAM_ID, this.provider);
  }

  async createAsset(
    name: string,
    symbol: string,
    decimals: number,
    initialSupply: number,
    owner: PublicKey
  ): Promise<string> {
    const mintKeypair = Keypair.generate();
    const assetMetadataKeypair = Keypair.generate();

    const tx = await this.program.methods
      .createAsset(name, symbol, decimals, new BN(initialSupply))
      .accounts({
        assetMetadata: assetMetadataKeypair.publicKey,
        authority: owner,
        mint: mintKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([mintKeypair, assetMetadataKeypair])
      .rpc();

    return tx;
  }
}

// Export a function to create a service instance dynamically
export function getSolanaService(wallet: any): SolanaService {
  return new SolanaService(wallet);
}
