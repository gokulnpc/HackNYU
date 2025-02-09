"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
} from "lucide-react";

// Mock data for vault history
const mockHistory = [
    {
        action: "Payment received",
        date: "Feb 01, 25, 02:50:26 AM",
        asset: "BlueAscent",
        from: "Asset Issuer",
        to: "BlueAscent",
        amount: "100,000,000,000.00",
    },
    {
        action: "Asset added",
        date: "Feb 01, 25, 02:48:36 AM",
        asset: "BlueAscent",
        from: "-",
        to: "-",
        amount: "-",
    },
    {
        action: "Vault created",
        date: "Feb 01, 25, 02:48:36 AM",
        asset: "-",
        from: "-",
        to: "-",
        amount: "-",
    },
];

const getActionIcon = (action: string) => {
    switch (action) {
        case "Payment received":
            return "↙";
        case "Asset added":
            return "⊕";
        case "Vault created":
            return "⚑";
        default:
            return "•";
    }
};

export default function VaultDetailsPage() {
    const params = useParams();
    const vaultName = decodeURIComponent(params.vaultName as string);

    return (
        <div className="p-8">
            <div className="mb-8">
                <Button variant="ghost" size="sm" asChild className="mb-4">
                    <Link href="/treasury">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Treasury
                    </Link>
                </Button>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold">{vaultName}</h1>
                        <Badge variant="secondary" className="bg-red-200 hover:bg-red-300">
                            BlueAscent
                        </Badge>
                        <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button variant="outline">Actions</Button>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold mb-4">Assets</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-500 rounded-full" />
                                <span>{vaultName}</span>
                            </div>
                            <span className="font-mono">100,000,000,000.00</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-4">Vault&apos;s history</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ACTION</TableHead>
                                    <TableHead>DATE</TableHead>
                                    <TableHead>ASSET</TableHead>
                                    <TableHead>FROM</TableHead>
                                    <TableHead>TO</TableHead>
                                    <TableHead className="text-right">AMOUNT</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockHistory.map((record, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{getActionIcon(record.action)}</span>
                                                {record.action}
                                            </div>
                                        </TableCell>
                                        <TableCell>{record.date}</TableCell>
                                        <TableCell>{record.asset}</TableCell>
                                        <TableCell>{record.from}</TableCell>
                                        <TableCell>{record.to}</TableCell>
                                        <TableCell className="text-right font-mono">
                                            {record.amount}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex items-center justify-end gap-2 p-4">
                            <Button variant="outline" size="icon">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}