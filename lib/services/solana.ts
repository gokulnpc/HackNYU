import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import {
  Program,
  AnchorProvider,
  BN,
  Idl,
  ProgramAccount,
} from "@project-serum/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import idl from "./idl.json";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";

// Configuration
const SOLANA_RPC = "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey(
  "EsQzosNPuUQqTamLa3duvkD7pQyoNjKPGbgf7FBcqjSo"
);
const MIN_BALANCE_FOR_TRANSACTION = 0.1; // SOL

// Initialize connection
const connection = new Connection(SOLANA_RPC, "confirmed");
console.log("✅ Solana Connection Established:", SOLANA_RPC);

// Asset metadata interfaces
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

  constructor(wallet: WalletContextState) {
    this.validateWallet(wallet);
    this.initializeConnection();
    this.setupProvider(wallet);
    this.verifyProgramDeployment();
  }

  private validateWallet(wallet: WalletContextState) {
    if (
      !wallet.publicKey ||
      !wallet.signTransaction ||
      !wallet.signAllTransactions
    ) {
      throw new Error("❌ Wallet not connected properly");
    }
    console.log("✅ Wallet connected:", wallet.publicKey.toBase58());
  }

  private async initializeConnection() {
    try {
      this.connection = new Connection(SOLANA_RPC, "confirmed");
      const version = await this.connection.getVersion();
      console.log("✅ Connection established. Version:", version);
    } catch (error) {
      throw new Error(
        `Failed to establish Solana connection: ${error.message}`
      );
    }
  }

  private setupProvider(wallet: WalletContextState) {
    const anchorWallet = {
      publicKey: wallet.publicKey!,
      signTransaction: wallet.signTransaction!,
      signAllTransactions: wallet.signAllTransactions!,
    };

    this.provider = new AnchorProvider(this.connection, anchorWallet, {
      preflightCommitment: "confirmed",
    });

    this.program = new Program(idl as Idl, PROGRAM_ID, this.provider);
  }

  private async verifyProgramDeployment() {
    try {
      const programInfo = await this.connection.getAccountInfo(PROGRAM_ID);
      if (!programInfo) {
        throw new Error(`Program not found at: ${PROGRAM_ID.toBase58()}`);
      }
      console.log("✅ Program verified at:", PROGRAM_ID.toBase58());
    } catch (error) {
      console.error("❌ Program verification failed:", error);
      throw error;
    }
  }

  private async checkBalance(owner: PublicKey): Promise<void> {
    const balance = await this.connection.getBalance(owner);
    const balanceInSol = balance / 1e9;
    console.log("💰 Current balance:", balanceInSol, "SOL");

    if (balanceInSol < MIN_BALANCE_FOR_TRANSACTION) {
      throw new Error(
        `Insufficient balance. Required: ${MIN_BALANCE_FOR_TRANSACTION} SOL, Current: ${balanceInSol} SOL`
      );
    }
  }

  private async executeWithRetry(
    operation: () => Promise<string>,
    maxRetries = 3
  ): Promise<string> {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * i));
          console.log(`🔄 Retry attempt ${i + 1}/${maxRetries}`);
        }
        return await operation();
      } catch (error) {
        console.log(`❌ Attempt ${i + 1} failed:`, error);
        lastError = error;

        if (
          error.message.includes("insufficient funds") ||
          error.message.includes("Invalid program id")
        ) {
          break; // Don't retry unrecoverable errors
        }
      }
    }
    throw lastError;
  }

  async getAllAssets(): Promise<AssetMetadata[]> {
    try {
      console.log("📡 Fetching all assets...");
      const accounts = await this.program.account.assetMetadata.all();
      console.log("✅ Fetched all assets:", accounts);
      return accounts.map((account) => ({
        name: account.account.name as string,
        code: account.account.code as string,
        assetType: account.account.assetType as string,
        decimals: account.account.decimals as number,
        initialSupply: (account.account.initialSupply as BN).toString(),
        limit: account.account.limit
          ? (account.account.limit as BN).toString()
          : undefined,
        authorizeRequired: account.account.authorizeRequired as boolean,
        freezeEnabled: account.account.freezeEnabled as boolean,
        clawbackEnabled: account.account.clawbackEnabled as boolean,
        regulated: account.account.regulated as boolean,
        mintAddress: (account.account.owner as PublicKey)?.toBase58(),
      }));
    } catch (error) {
      console.error("❌ Error fetching assets:", error);
      throw error;
    }
  }

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
      // Validate balance before proceeding
      await this.checkBalance(owner);

      console.log("🚀 Creating asset:", {
        name,
        code,
        assetType,
        initialSupply,
        limit,
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

      console.log("✅ Simulation successful:", simulation.raw);

      // Execute actual transaction with retry logic
      const tx = await this.executeWithRetry(async () => {
        return await this.program.methods
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
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
          })
          .signers([mintKeypair, assetMetadataKeypair])
          .rpc();
      });

      console.log("✅ Transaction successful:", tx);
      return tx;
    } catch (error) {
      console.error("❌ Error creating asset:", {
        error,
        logs: error?.logs,
        message: error?.message,
      });
      throw error;
    }
  }

  async getAssetByMint(mintAddress: PublicKey): Promise<AssetMetadata | null> {
    try {
      console.log(`🔍 Fetching asset with mint: ${mintAddress.toBase58()}`);
      const account = (await this.program.account.assetMetadata.fetch(
        mintAddress
      )) as unknown as RawAssetMetadata;

      if (!account) return null;

      return {
        name: account.name as string,
        code: account.code as string,
        assetType: account.assetType as string,
        decimals: account.decimals as number,
        initialSupply: account.initialSupply.toNumber(),
        limit: account.limit?.toNumber(),
        authorizeRequired: account.authorizeRequired,
        freezeEnabled: account.freezeEnabled,
        clawbackEnabled: account.clawbackEnabled,
        regulated: account.regulated,
        mintAddress: account.mintAddress.toBase58(),
      };
    } catch (error) {
      console.error("❌ Error fetching asset:", error);
      return null;
    }
  }
}

export function getSolanaService(wallet: WalletContextState): SolanaService {
  return new SolanaService(wallet);
}
