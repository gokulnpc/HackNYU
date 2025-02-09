"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import { Search, ArrowUpDown, Plus, Filter } from "lucide-react";
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

const assetTypes = [
  "All Types",
  "Payment Token",
  "Security Token",
  "Utility Token",
];
const statusOptions = ["All Status", "Active", "Paused", "Frozen"];

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [sortBy, setSortBy] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "name",
    direction: "asc",
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

  const filteredAssets = assets
    .filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        selectedType === "All Types" || asset.assetType === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const direction = sortBy.direction === "asc" ? 1 : -1;
      return a[sortBy.field as keyof typeof a] >
        b[sortBy.field as keyof typeof b]
        ? direction
        : -direction;
    });

  const handleSort = (field: string) => {
    setSortBy((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-green-soft">
      <div className="p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800">
              Digital Assets
            </h1>
            <p className="text-green-600 mt-1">
              Manage and monitor your digital assets
            </p>
          </div>
          <Button
            asChild
            className="bg-gradient-green hover:opacity-90 transition-opacity"
          >
            <Link href="/forge" className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Asset
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-green-500" />
              <Input
                placeholder="Search by name or code"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-green-100 focus:border-green-500 transition-colors"
              />
            </div>
            <div className="flex gap-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px] border-green-100">
                  <Filter className="h-4 w-4 mr-2 text-green-500" />
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
                <SelectTrigger className="w-[180px] border-green-100">
                  <Filter className="h-4 w-4 mr-2 text-green-500" />
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
          </div>

          <div className="rounded-lg border border-green-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-green-50 hover:bg-green-50/80">
                  <TableHead className="w-[100px] font-semibold">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("code")}
                      className="font-semibold text-black hover:text-black"
                    >
                      Code
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("name")}
                      className="font-semibold text-black hover:text-black"
                    >
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-green-900">
                    Type
                  </TableHead>
                  <TableHead className="text-right font-semibold text-green-900">
                    Supply
                  </TableHead>
                  <TableHead className="font-semibold text-green-900">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-semibold text-green-900">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
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
                ) : filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-green-600">
                        {searchTerm || selectedType !== "All Types"
                          ? "No assets found matching your filters"
                          : "No assets found. Create your first asset!"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset) => (
                    <TableRow
                      key={asset.mintAddress}
                      className="hover:bg-green-50/50"
                    >
                      <TableCell className="font-medium text-green-800">
                        {asset.code}
                      </TableCell>
                      <TableCell className="text-green-800">
                        {asset.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 hover:bg-green-200"
                        >
                          {asset.assetType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-green-800 font-mono">
                        {asset.initialSupply}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={asset.regulated ? "secondary" : "default"}
                          className={
                            asset.regulated
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          }
                        >
                          {asset.regulated ? "Regulated" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-green-700 hover:text-green-800 hover:bg-green-100"
                        >
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
      </div>
    </div>
  );
}
