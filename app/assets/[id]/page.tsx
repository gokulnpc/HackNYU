"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getSolanaService } from "@/lib/services/solana";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Coins,
  ArrowLeftRight,
  Shield,
  Clock,
  ArrowLeft,
  Info,
  Flame,
  Share2,
  Lock,
  RefreshCw,
  FileText,
  Home
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface AssetDetails {
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

export default function AssetDetailsPage() {
  const params = useParams();
  const assetId = params.id as string;
  const [asset, setAsset] = useState<AssetDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [mintAmount, setMintAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [distributeAmount, setDistributeAmount] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [circulatingSupply, setCirculatingSupply] = useState("0.00");
  const [mainVaultBalance, setMainVaultBalance] = useState("54,000,113.00");
  const wallet = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAssetDetails = async () => {
      if (!wallet.publicKey) return;

      try {
        const solanaService = getSolanaService(wallet);
        const assetDetails = await solanaService.getAssetByMint(assetId);
        if (assetDetails) {
          setAsset({
            ...assetDetails,
            mintAddress: assetId
          });
          setCirculatingSupply("0.00");
          setMainVaultBalance("54,000,113.00");
        }
      } catch (error) {
        console.error("Error fetching asset details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch asset details. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssetDetails();
  }, [assetId, wallet.publicKey, toast]);

  const handleMint = async () => {
    if (!wallet.publicKey || !asset) return;
    try {
      toast({
        title: "Success",
        description: `Successfully minted ${mintAmount} ${asset.code} tokens`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mint tokens. Please try again.",
      });
    }
  };

  const handleBurn = async () => {
    if (!wallet.publicKey || !asset) return;
    try {
      toast({
        title: "Success",
        description: `Successfully burned ${burnAmount} ${asset.code} tokens`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to burn tokens. Please try again.",
      });
    }
  };

  const handleDistribute = async () => {
    if (!wallet.publicKey || !asset) return;
    try {
      toast({
        title: "Success",
        description: `Successfully distributed ${distributeAmount} ${asset.code} tokens`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to distribute tokens. Please try again.",
      });
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading asset details...</div>;
  }

  if (!asset) {
    return <div className="p-8">Asset not found</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "mint":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mint Assets</CardTitle>
                <CardDescription>Create new tokens and add them to circulation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount to mint</label>
                  <Input
                    type="number"
                    placeholder="Enter amount to mint..."
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Circulation supply: {circulatingSupply} {asset.code}
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Main vault: {mainVaultBalance} {asset.code}
                  </div>
                </div>

                <Button onClick={handleMint} className="w-full">
                  Mint asset
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About Mint</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  Minting allows for the creation of new tokens on the Stellar Network.
                  When minting, a predefined number of tokens are added to the issuer's
                  account, increasing the total supply. This process is used for
                  distributing rewards, or any system where new token generation is needed.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "burn":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Burn Assets</CardTitle>
                <CardDescription>Permanently remove tokens from circulation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount to burn</label>
                  <Input
                    type="number"
                    placeholder="Enter amount to burn..."
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Circulation supply: {circulatingSupply} {asset.code}
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Main vault: {mainVaultBalance} {asset.code}
                  </div>
                </div>

                <Button onClick={handleBurn} className="w-full">
                  Burn asset
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About Burn</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  Burning is the process of permanently removing tokens from circulation
                  on the Stellar Network. This reduces the total supply and can be used
                  for mechanisms like token buybacks or reducing available supply to
                  increase scarcity.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "distribute":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribute Assets</CardTitle>
                <CardDescription>Send tokens to other accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Destination</label>
                  <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vault1">Main Vault</SelectItem>
                      <SelectItem value="vault2">Secondary Vault</SelectItem>
                      <SelectItem value="custom">Custom Address</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <Input
                    type="number"
                    placeholder="Enter amount to distribute..."
                    value={distributeAmount}
                    onChange={(e) => setDistributeAmount(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Main Vault: {mainVaultBalance} {asset.code}
                </div>

                <Button onClick={handleDistribute} className="w-full">
                  Distribute asset
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About Distribution</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  Distribution refers to the process of allocating tokens to various
                  accounts on the Stellar Network. This can be done through sales,
                  rewards, or airdrops, enabling tokens to circulate effectively
                  in the ecosystem.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Overview</CardTitle>
                <CardDescription>Key details and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                    <dd className="text-lg">{asset.assetType}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Supply</dt>
                    <dd className="text-lg">{asset.initialSupply}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Decimals</dt>
                    <dd className="text-lg">{asset.decimals}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Regulated</dt>
                    <dd className="text-lg">{asset.regulated ? "Yes" : "No"}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Authorization Required</span>
                  <Badge variant="outline">{asset.authorizeRequired ? "Yes" : "No"}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Freeze Enabled</span>
                  <Badge variant="outline">{asset.freezeEnabled ? "Yes" : "No"}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Clawback Enabled</span>
                  <Badge variant="outline">{asset.clawbackEnabled ? "Yes" : "No"}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 p-8">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/assets">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assets
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">{asset.name}</h1>
            <Badge variant="outline">{asset.code}</Badge>
            <Badge variant={asset.regulated ? "secondary" : "default"}>
              {asset.assetType}
            </Badge>
          </div>
        </div>

        {renderContent()}
      </div>

      <div className="w-64 border-l p-4 space-y-2">
        <h2 className="font-semibold mb-4">Actions</h2>
        <Button
          variant={activeTab === "home" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("home")}
        >
          <Home className="mr-2 h-4 w-4" />
          Asset home
        </Button>
        <Button
          variant={activeTab === "mint" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("mint")}
        >
          <Coins className="mr-2 h-4 w-4" />
          Mint assets
        </Button>
        <Button
          variant={activeTab === "burn" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("burn")}
        >
          <Flame className="mr-2 h-4 w-4" />
          Burn assets
        </Button>
        <Button
          variant={activeTab === "distribute" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("distribute")}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Distribute
        </Button>
        <Button
          variant={activeTab === "authorize" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("authorize")}
        >
          <Lock className="mr-2 h-4 w-4" />
          Authorize account
        </Button>
        <Button
          variant={activeTab === "freeze" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("freeze")}
        >
          <Shield className="mr-2 h-4 w-4" />
          Freeze account
        </Button>
        <Button
          variant={activeTab === "clawback" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("clawback")}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Clawback
        </Button>
        <Button
          variant={activeTab === "publish" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("publish")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Publish information
        </Button>
      </div>
    </div>
  );
}