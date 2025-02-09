"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Wallet,
  Coins,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  name: string;
  symbol: string;
  mint: string;
}

export default function ProfilePage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { toast } = useToast();
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!wallet.publicKey) return;
      try {
        const balance = await connection.getBalance(wallet.publicKey);
        setWalletBalance(balance / 1e9); // Convert lamports to SOL
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };

    fetchBalance();
  }, [wallet.publicKey, connection]);

  useEffect(() => {
    const fetchAssets = async () => {
      if (!wallet.publicKey || !wallet) return;

      try {
        const solanaService = getSolanaService(wallet);
        const metadata = await solanaService.getAllAssets();
        const assetsList: Asset[] = metadata.map((asset) => ({
          name: asset.name,
          symbol: asset.code,
          mint: asset.mintAddress,
        }));
        setAssets(assetsList);
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [wallet.publicKey, wallet]);

  const copyAddress = async () => {
    if (!wallet.publicKey) return;
    try {
      await navigator.clipboard.writeText(wallet.publicKey.toString());
      setCopySuccess(true);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy address",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-green-soft">
      <div className="p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800">
              Profile & Wallet
            </h1>
            <p className="text-green-600 mt-1">
              Manage your wallet and view owned assets
            </p>
          </div>
          <WalletMultiButton />
        </div>

        {wallet.connected ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card className="bg-white border-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Wallet className="h-5 w-5 text-green-600" />
                    Wallet Information
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Connected wallet details and balance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
                    <div className="space-y-1">
                      <p className="text-sm text-green-600">Wallet Address</p>
                      <p className="font-mono text-green-800">
                        {formatAddress(wallet.publicKey?.toBase58() || "", 12)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyAddress}
                      className="border-green-200 text-green-700 hover:bg-green-100"
                    >
                      {copySuccess ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
                    <div className="space-y-1">
                      <p className="text-sm text-green-600">SOL Balance</p>
                      <p className="text-2xl font-bold text-green-800">
                        {walletBalance !== null
                          ? `${walletBalance.toFixed(4)} SOL`
                          : "Loading..."}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-green-200 text-green-700 hover:bg-green-100"
                      onClick={() =>
                        window.open("https://solfaucet.com", "_blank")
                      }
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Coins className="h-5 w-5 text-green-600" />
                    Asset Summary
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Overview of your digital assets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-green-50">
                      <p className="text-sm text-green-600 mb-1">
                        Total Assets
                      </p>
                      <p className="text-2xl font-bold text-green-800">
                        {assets.length}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50">
                      <p className="text-sm text-green-600 mb-1">Network</p>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        Devnet
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-green-100">
              <CardHeader>
                <CardTitle className="text-green-800">Owned Assets</CardTitle>
                <CardDescription className="text-green-600">
                  Digital assets in your wallet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-green-50">
                      <TableHead className="text-green-800">Name</TableHead>
                      <TableHead className="text-green-800">Symbol</TableHead>
                      <TableHead className="text-green-800">
                        Mint Address
                      </TableHead>
                      <TableHead className="text-green-800">Explorer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <div className="flex items-center justify-center text-green-600">
                            <svg
                              className="animate-spin h-5 w-5 mr-3"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Loading assets...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : assets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-green-600 space-y-2">
                            <AlertCircle className="h-8 w-8" />
                            <p>No assets found in your wallet</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      assets.map((asset) => (
                        <TableRow
                          key={asset.mint}
                          className="hover:bg-green-50"
                        >
                          <TableCell className="font-medium text-green-800">
                            {asset.name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 border-green-200"
                            >
                              {asset.symbol}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-green-700">
                            {formatAddress(asset.mint)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700 hover:bg-green-100"
                              onClick={() =>
                                window.open(
                                  `https://explorer.solana.com/address/${asset.mint}?cluster=devnet`,
                                  "_blank"
                                )
                              }
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="bg-white border-green-100">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-green-600 mb-4" />
              <h2 className="text-xl font-semibold text-green-800 mb-2">
                Wallet Not Connected
              </h2>
              <p className="text-green-600 mb-6">
                Please connect your wallet to view your profile
              </p>
              <WalletMultiButton />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
