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

// Configuration
const SOLANA_RPC = "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey(
  "HJTHhCPBZotdBWftcvSwkLKyGi2C56cUtTDqnjV2RaCZ"
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

      return accounts.map((account: ProgramAccount<any>) => {
        const asset = account.account as RawAssetMetadata;
        return {
          name: asset.name,
          code: asset.code,
          assetType: asset.assetType,
          decimals: asset.decimals,
          initialSupply: asset.initialSupply.toNumber(),
          limit: asset.limit?.toNumber(),
          authorizeRequired: asset.authorizeRequired,
          freezeEnabled: asset.freezeEnabled,
          clawbackEnabled: asset.clawbackEnabled,
          regulated: asset.regulated,
          mintAddress: asset.mintAddress.toBase58(),
        };
      });
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

      const mintKeypair = Keypair.generate();
      const assetMetadataKeypair = Keypair.generate();
      const limitValue = limit ? new BN(limit) : null;

      console.log("🔑 Generated Keypairs:", {
        mint: mintKeypair.publicKey.toBase58(),
        metadata: assetMetadataKeypair.publicKey.toBase58(),
      });

      // Simulate transaction first
      const simulation = await this.program.methods
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
        .simulate();

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
      const account = await this.program.account.assetMetadata.fetch(
        mintAddress
      );

      if (!account) return null;

      return {
        name: account.name,
        code: account.code,
        assetType: account.assetType,
        decimals: account.decimals,
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
