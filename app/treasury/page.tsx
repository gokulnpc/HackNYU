"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Lock, Plus, Search } from "lucide-react";
import Link from "next/link";

// Mock data for vaults
const vaults = [
  {
    name: "Aminyazdanii",
    type: "Hedge Fund",
    assets: [{ code: "1234", balance: "0.00" }],
  },
  {
    name: "A.R.K.D",
    type: "parent vault",
    assets: [{ code: "INF", balance: "963,963,963.00" }],
  },
  {
    name: "BlueAscent",
    type: "BlueAscent",
    assets: [{ code: "BlueAscent", balance: "100,000,000,000.00" }],
  },
  {
    name: "Bogotá University",
    type: "Bogotá",
    assets: [
      { code: "00125012M", balance: "0.00", locked: true },
      { code: "F05885462GC", balance: "0.00" },
      { code: "jCiEjB0025C", balance: "0.00" },
    ],
  },
  {
    name: "CBDC",
    type: "BONDS",
    assets: [{ code: "INF", balance: "666,666,666,666.00" }],
  },
  {
    name: "COCOBOD",
    type: "BONDS",
    assets: [{ code: "GHCOCOA", balance: "0.00" }],
  },
  {
    name: "DEVIKO CONSTRUCTION ACCOUNT",
    type: "PAYMENTS",
    assets: [
      { code: "DCON", balance: "0.00" },
      { code: "USDT", balance: "0.00" },
    ],
  },
  {
    name: "Fifo Vault",
    type: "Hedge Fund",
    assets: [{ code: "USBC", balance: "0.00", locked: true }],
  },
  {
    name: "FLUX",
    type: "FLUX",
    assets: [{ code: "FLUX", balance: "11,000,000,000.00" }],
  },
  {
    name: "Foreign Markets",
    type: "Hedge Fund",
    assets: [{ code: "PTRI", balance: "0.00", locked: true }],
  },
  {
    name: "Glik",
    type: "Bogotá",
    assets: [{ code: "GLIM", balance: "0.00" }],
  },
  {
    name: "Gloria Inc",
    type: "EQUITY",
    assets: [
      { code: "DCON", balance: "0.00" },
      { code: "USDT", balance: "0.00" },
    ],
  },
];

// Type badge colors
const typeBadgeColors: { [key: string]: string } = {
  "Hedge Fund": "bg-blue-100 text-blue-800 hover:bg-blue-200",
  "parent vault": "bg-purple-100 text-purple-800 hover:bg-purple-200",
  BlueAscent: "bg-red-100 text-red-800 hover:bg-red-200",
  Bogotá: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  BONDS: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  PAYMENTS: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  FLUX: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
  EQUITY: "bg-violet-100 text-violet-800 hover:bg-violet-200",
};

export default function TreasuryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVaults = vaults.filter((vault) =>
    vault.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-green-soft">
      <div className="p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Treasury</h1>
            <p className="text-green-600 mt-1">
              Manage and monitor your vaults
            </p>
          </div>
          <Button className="bg-gradient-green hover:opacity-90 transition-opacity gap-2">
            <Plus className="h-4 w-4" />
            Create Vault
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-green-500" />
            <Input
              placeholder="Search vaults..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-green-100 focus:border-green-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredVaults.map((vault) => (
              <Link
                key={vault.name}
                href={`/treasury/${encodeURIComponent(vault.name)}`}
                className="block h-[160px] group"
              >
                <div className="bg-white rounded-lg shadow-sm border border-green-100 p-4 h-full hover:shadow-md transition-all duration-200 group-hover:border-green-200">
                  <div className="flex-none mb-3">
                    <h3 className="text-base font-medium mb-2 text-green-800 line-clamp-1">
                      {vault.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={`font-normal text-xs ${
                        typeBadgeColors[vault.type] ||
                        "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {vault.type}
                    </Badge>
                  </div>

                  <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
                    {vault.assets.map((asset) => (
                      <div
                        key={asset.code}
                        className="flex items-center justify-between text-sm py-1.5 border-b last:border-b-0 border-green-50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-green-700">
                            {asset.code}
                          </span>
                          {asset.locked && (
                            <Lock className="h-3 w-3 text-amber-500" />
                          )}
                        </div>
                        <span className="font-mono text-xs text-green-600">
                          {asset.balance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
