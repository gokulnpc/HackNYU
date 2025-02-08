"use client";

import { useParams } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

// Mock data - replace with actual data from your backend
const assetDetails = {
  id: "1",
  code: "GATE",
  name: "29Zone",
  type: "Payment Token",
  supply: "1000000",
  status: "Active",
  decimals: 6,
  issueDate: "2024-03-20",
  owner: "0x1234...5678",
  description: "A payment token for the 29Zone ecosystem",
  transfers: [
    {
      id: "1",
      from: "0x1234...5678",
      to: "0x8765...4321",
      amount: "1000",
      timestamp: "2024-03-21 14:30:00"
    },
    {
      id: "2",
      from: "0x8765...4321",
      to: "0x2468...1357",
      amount: "500",
      timestamp: "2024-03-21 15:45:00"
    }
  ]
};

export default function AssetDetailsPage() {
  const params = useParams();
  const assetId = params.id;

  // In a real app, fetch asset details using the assetId

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/assets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assets
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Asset Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              {assetDetails.name}
              <Badge className="ml-2">{assetDetails.status}</Badge>
            </CardTitle>
            <CardDescription>{assetDetails.code}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                <dd className="text-lg">{assetDetails.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Supply</dt>
                <dd className="text-lg">{assetDetails.supply}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Decimals</dt>
                <dd className="text-lg">{assetDetails.decimals}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Issue Date</dt>
                <dd className="text-lg">{assetDetails.issueDate}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Owner</dt>
                <dd className="text-lg font-mono">{assetDetails.owner}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                <dd className="text-lg">{assetDetails.description}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Transferable</span>
              <Badge variant="outline">Yes</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>KYC Required</span>
              <Badge variant="outline">No</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Max Transfer Amount</span>
              <Badge variant="outline">100,000</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              Transfer History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>
                    <Clock className="h-4 w-4" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assetDetails.transfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-mono">{transfer.from}</TableCell>
                    <TableCell className="font-mono">{transfer.to}</TableCell>
                    <TableCell className="text-right">{transfer.amount}</TableCell>
                    <TableCell>{transfer.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}