"use client";

import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { getSolanaService } from "@/lib/services/solana";
import { formatAddress } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// Define TypeScript interface for asset data
interface Asset {
  name: string;
  symbol: string;
  mint: string;
}

export default function ProfilePage() {
  const { connection } = useConnection();
  const { publicKey, wallet, connected } = useWallet(); // Ensure wallet is accessed correctly
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]); // Proper TypeScript type

  useEffect(() => {
    if (!publicKey) return;

    const fetchBalance = async () => {
      try {
        const balance = await connection.getBalance(publicKey);
        setWalletBalance(balance / 1e9); // Convert lamports to SOL
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };

    fetchBalance();
  }, [publicKey, connection]);

  useEffect(() => {
    if (!publicKey || !wallet) return;

    const fetchAssets = async () => {
      try {
        const solanaService = getSolanaService(wallet); // ✅ Pass wallet instance
        const assetsList: Asset[] = await solanaService.getAllAssets(); // Ensure it returns an array of `Asset`
        setAssets(assetsList);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    fetchAssets();
  }, [publicKey, wallet]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Profile & Wallet</h1>
        <WalletMultiButton />
      </div>

      {connected && (
        <Card>
          <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
            <CardDescription>Connected wallet details</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Wallet Address:</strong>{" "}
              {formatAddress(publicKey?.toBase58() || "")}
            </p>
            <p>
              <strong>Balance:</strong>{" "}
              {walletBalance !== null ? `${walletBalance} SOL` : "Loading..."}
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Owned Assets</CardTitle>
          <CardDescription>Tokens you own on Solana</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Mint Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.length > 0 ? (
                assets.map((asset) => (
                  <TableRow key={asset.mint}>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{asset.symbol}</Badge>
                    </TableCell>
                    <TableCell>{formatAddress(asset.mint)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No assets found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
