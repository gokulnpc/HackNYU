"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
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
    "Hedge Fund": "bg-sky-200 hover:bg-sky-300",
    "parent vault": "bg-sky-200 hover:bg-sky-300",
    BlueAscent: "bg-red-200 hover:bg-red-300",
    Bogotá: "bg-emerald-200 hover:bg-emerald-300",
    BONDS: "bg-sky-200 hover:bg-sky-300",
    PAYMENTS: "bg-sky-200 hover:bg-sky-300",
    FLUX: "bg-sky-200 hover:bg-sky-300",
    EQUITY: "bg-violet-200 hover:bg-violet-300",
};

export default function TreasuryPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredVaults = vaults.filter((vault) =>
        vault.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Treasury</h1>
                <Button size="lg">Create Vault</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredVaults.map((vault) => (
                    <Link
                        key={vault.name}
                        href={`/treasury/${encodeURIComponent(vault.name)}`}
                        className="block h-[160px]"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 h-full hover:shadow-md transition-shadow flex flex-col">
                            <div className="flex-none mb-3">
                                <h3 className="text-base font-medium mb-2 line-clamp-1">{vault.name}</h3>
                                <Badge
                                    className={`font-normal text-xs ${typeBadgeColors[vault.type] || "bg-gray-200"
                                        }`}
                                    variant="secondary"
                                >
                                    {vault.type}
                                </Badge>
                            </div>

                            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
                                {vault.assets.map((asset) => (
                                    <div
                                        key={asset.code}
                                        className="flex items-center justify-between text-sm py-1.5 border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs">{asset.code}</span>
                                            {asset.locked && <Lock className="h-3 w-3 text-gray-500" />}
                                        </div>
                                        <span className="font-mono text-xs">{asset.balance}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}