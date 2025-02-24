import { Connection, PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import {
  Program,
  AnchorProvider,
  BN,
  Idl,
  ProgramAccount,
} from "@project-serum/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import idl from "./idl.json";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";

// ✅ Set Localnet RPC
const SOLANA_RPC = "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey(
  "EsQzosNPuUQqTamLa3duvkD7pQyoNjKPGbgf7FBcqjSo"
);

// ✅ Initialize the connection globally
const connection = new Connection(SOLANA_RPC, "confirmed");
console.log("✅ Solana Localnet Connection Established");

// ✅ Define the expected Asset Metadata Account Type
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
  owner: PublicKey;
}

// ✅ Processed metadata structure for frontend use
interface AssetMetadata {
  name: string;
  code: string;
  assetType: string;
  decimals: number;
  initialSupply: string;
  limit?: string;
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

  constructor(wallet: WalletContextState) {
    if (
      !wallet.publicKey ||
      !wallet.signTransaction ||
      !wallet.signAllTransactions
    ) {
      throw new Error("❌ Wallet not connected properly");
    }
    console.log("✅ Wallet connected:", wallet.publicKey.toBase58());
    // ✅ Create AnchorProvider with Localnet RPC
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

  /**
   * ✅ Fetch all issued assets from the blockchain.
   */
  async getAllAssets(): Promise<AssetMetadata[]> {
    try {
      console.log("📡 Fetching all assets...");
      const accounts = await this.program.account.assetMetadata.all();
      console.log("✅ Fetched all assets:", accounts);
      return accounts.map((account) => ({
        name: account.account.name,
        code: account.account.code,
        assetType: account.account.assetType,
        decimals: account.account.decimals,
        initialSupply: account.account.initialSupply.toString(),
        limit: account.account.limit ? account.account.limit.toString() : undefined,
        authorizeRequired: account.account.authorizeRequired,
        freezeEnabled: account.account.freezeEnabled,
        clawbackEnabled: account.account.clawbackEnabled,
        regulated: account.account.regulated,
        mintAddress: account.publicKey.toString()
      }));
    } catch (error) {
      console.error("❌ Error fetching assets:", error);
      throw error;
    }
  }

  /**
   * ✅ Create a new asset on the Solana blockchain.
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
      console.log("🚀 Creating asset:", {
        name,
        code,
        assetType,
        initialSupply,
        limit,
        authorizeRequired,
        freezeEnabled,
        clawbackEnabled,
        regulated,
        owner: owner.toBase58(),
      });

      const assetMetadataKeypair = Keypair.generate();
      const limitValue = limit ? new BN(limit) : null;

      console.log(
        "🔑 Generated Metadata Keypair:",
        assetMetadataKeypair.publicKey.toBase58()
      );

      console.log("Accounts: ", {
        assetMetadata: assetMetadataKeypair.publicKey.toString(),
        authority: owner.toString(),
        mint: owner.toString(),
        tokenAccount: owner.toString(),
        tokenProgram: TOKEN_PROGRAM_ID.toString(),
        systemProgram: SystemProgram.programId.toString(),
        rent: anchor.web3.SYSVAR_RENT_PUBKEY.toString(),
      });
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
          assetMetadata: assetMetadataKeypair.publicKey.toString(),
          authority: owner.toString(),
          mint: owner.toString(),
          tokenAccount: owner.toString(),
          tokenProgram: TOKEN_PROGRAM_ID.toString(),
          systemProgram: SystemProgram.programId.toString(),
          rent: anchor.web3.SYSVAR_RENT_PUBKEY.toString(),
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

  /**
   * ✅ Get a specific asset by mint address
   */
  async getAssetByMint(mintAddress: string): Promise<AssetMetadata | null> {
    try {
      console.log(`🔍 Fetching asset with mint: ${mintAddress}`);
      const publicKey = new PublicKey(mintAddress);
      const account = await this.program.account.assetMetadata.fetch(publicKey);

      if (!account) return null;

      return {
        name: account.name,
        code: account.code,
        assetType: account.assetType,
        decimals: account.decimals,
        initialSupply: account.initialSupply.toString(),
        limit: account.limit ? account.limit.toString() : undefined,
        authorizeRequired: account.authorizeRequired,
        freezeEnabled: account.freezeEnabled,
        clawbackEnabled: account.clawbackEnabled,
        regulated: account.regulated,
        mintAddress: mintAddress
      };
    } catch (error) {
      console.error("❌ Error fetching asset:", error);
      return null;
    }
  }
}

/**
 * ✅ Get Solana Service Instance
 */
export function getSolanaService(wallet: WalletContextState): SolanaService {
  return new SolanaService(wallet);
}