import { Connection, PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider, BN, Idl } from "@project-serum/anchor";
import idl from "./idl.json"; // Ensure this file exists

const PROGRAM_ID = new PublicKey(
  "HJTHhCPBZotdBWftcvSwkLKyGi2C56cUtTDqnjV2RaCZ"
);
const SOLANA_RPC = "https://api.devnet.solana.com"; // Devnet RPC endpoint

// ✅ Define the expected Asset Metadata Account Type
interface AssetMetadata {
  name: string;
  symbol: string;
  mint: string;
}

// ✅ Corrected Asset Account type for Anchor Program Accounts
interface AssetAccount {
  publicKey: PublicKey; // The public key of the account
  account: {
    name: string;
    symbol: string;
    mint: PublicKey;
  };
}

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

  /**
   * Fetch all issued assets from the blockchain.
   */
  async getAllAssets(): Promise<AssetMetadata[]> {
    try {
      // ✅ Correctly infer the type as `AssetAccount[]`
      const assets =
        (await this.program.account.assetMetadata.all()) as AssetAccount[];

      return assets.map((asset) => ({
        name: asset.account.name,
        symbol: asset.account.symbol,
        mint: asset.account.mint.toBase58(), // Convert mint to string
      }));
    } catch (error) {
      console.error("Error fetching assets:", error);
      throw error;
    }
  }

  /**
   * Create a new asset on the Solana blockchain.
   * @param name - Name of the asset
   * @param symbol - Symbol for the asset
   * @param decimals - Number of decimal places
   * @param initialSupply - Initial supply of the asset
   * @param owner - Public key of the asset owner
   * @returns Transaction Signature
   */
  async createAsset(
    name: string,
    symbol: string,
    decimals: number,
    initialSupply: number,
    owner: PublicKey
  ): Promise<string> {
    try {
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

      console.log("Transaction Signature:", tx);
      return tx;
    } catch (error) {
      console.error("Error creating asset:", error);
      throw error;
    }
  }
}

// Export a function to create a service instance dynamically
export function getSolanaService(wallet: any): SolanaService {
  return new SolanaService(wallet);
}
