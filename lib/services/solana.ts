import { Connection, PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import {
  Program,
  AnchorProvider,
  BN,
  Idl,
  ProgramAccount,
} from "@project-serum/anchor";
import idl from "./idl.json";

const PROGRAM_ID = new PublicKey(
  "HJTHhCPBZotdBWftcvSwkLKyGi2C56cUtTDqnjV2RaCZ"
);
const SOLANA_RPC = "https://api.devnet.solana.com";

// Define the raw account structure that matches your IDL
interface RawAssetMetadata {
  name: string;
  code: string;
  assetType: string;
  decimals: number;
  initialSupply: BN;
  limit: BN | null;
  authorizeRequired: boolean;
  freezeEnabled: boolean;
  clawbackEnabled: boolean;
  regulated: boolean;
  mintAddress: PublicKey;
}

// Define the processed metadata structure for the frontend
interface AssetMetadata {
  name: string;
  code: string;
  assetType: string;
  decimals: number;
  initialSupply: number;
  limit?: number;
  authorizeRequired: boolean;
  freezeEnabled: boolean;
  clawbackEnabled: boolean;
  regulated: boolean;
  mintAddress: string;
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
    console.log("Provider:", this.provider);
    this.program = new Program(idl as Idl, PROGRAM_ID, this.provider);
  }

  /**
   * Fetch all issued assets from the blockchain.
   */
  async getAllAssets(): Promise<AssetMetadata[]> {
    try {
      const accounts = await this.program.account.assetMetadata.all();

      // Transform the raw accounts into our desired format
      return accounts.map((account: ProgramAccount<RawAssetMetadata>) => ({
        name: account.account.name,
        code: account.account.code,
        assetType: account.account.assetType,
        decimals: account.account.decimals,
        initialSupply: account.account.initialSupply.toNumber(),
        limit: account.account.limit
          ? account.account.limit.toNumber()
          : undefined,
        authorizeRequired: account.account.authorizeRequired,
        freezeEnabled: account.account.freezeEnabled,
        clawbackEnabled: account.account.clawbackEnabled,
        regulated: account.account.regulated,
        mintAddress: account.account.mintAddress.toBase58(),
      }));
    } catch (error) {
      console.error("Error fetching assets:", error);
      throw error;
    }
  }

  /**
   * Create a new asset on the Solana blockchain.
   * @returns Transaction Signature
   */
  async createAsset({
    name,
    code,
    assetType,
    decimals,
    initialSupply,
    limit,
    authorizeRequired,
    freezeEnabled,
    clawbackEnabled,
    regulated,
    owner,
  }: {
    name: string;
    code: string;
    assetType: string;
    decimals: number;
    initialSupply: number;
    limit?: number;
    authorizeRequired: boolean;
    freezeEnabled: boolean;
    clawbackEnabled: boolean;
    regulated: boolean;
    owner: PublicKey;
  }): Promise<string> {
    try {
      const mintKeypair = Keypair.generate();
      const assetMetadataKeypair = Keypair.generate();

      const limitValue = limit ? new BN(limit) : null;

      const tx = await this.program.methods
        .createAsset(
          name,
          code,
          assetType,
          decimals,
          new BN(initialSupply),
          limitValue,
          authorizeRequired,
          freezeEnabled,
          clawbackEnabled,
          regulated
        )
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

export function getSolanaService(wallet: any): SolanaService {
  return new SolanaService(wallet);
}
