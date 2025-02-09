"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { getSolanaService } from "@/lib/services/solana";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  name: string;
  code: string;
  assetType: string;
  initialSupply: string;
  mintAddress: string;
  regulated: boolean;
}

const assetTypes = ["All Types", "Payment Token", "Security Token", "Utility Token"];
const statusOptions = ["All Status", "Active", "Paused", "Frozen"];

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: "name",
    direction: "asc"
  });
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const wallet = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAssets = async () => {
      if (!wallet.publicKey) return;

      try {
        const solanaService = getSolanaService(wallet);
        const fetchedAssets = await solanaService.getAllAssets();
        setAssets(fetchedAssets);
      } catch (error) {
        console.error("Error fetching assets:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch assets. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [wallet, wallet.publicKey, toast]);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All Types" || asset.assetType === selectedType;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    const direction = sortBy.direction === 'asc' ? 1 : -1;
    return a[sortBy.field as keyof typeof a] > b[sortBy.field as keyof typeof b]
      ? direction
      : -direction;
  });

  const handleSort = (field: string) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Assets</h1>
        <Button asChild>
          <Link href="/forge">Create New Asset</Link>
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {assetTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" size="sm" onClick={() => handleSort('code')}>
                  Code
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('name')}>
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Supply</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading assets...
                </TableCell>
              </TableRow>
            ) : filteredAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {searchTerm || selectedType !== "All Types"
                    ? "No assets found matching your filters"
                    : "No assets found. Create your first asset!"}
                </TableCell>
              </TableRow>
            ) : (
              filteredAssets.map((asset) => (
                <TableRow key={asset.mintAddress}>
                  <TableCell className="font-medium">{asset.code}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.assetType}</TableCell>
                  <TableCell className="text-right">{asset.initialSupply}</TableCell>
                  <TableCell>
                    <Badge variant={asset.regulated ? "secondary" : "default"}>
                      {asset.regulated ? "Regulated" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/assets/${asset.mintAddress}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}