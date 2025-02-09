"use client";

import { useEffect, useState } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  Coins,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Link as LinkIcon,
  TrendingUp,
  Clock,
  Wallet,
} from "lucide-react";

// Mock data for the dashboard
const volumeData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  volume: Math.floor(Math.random() * 1000000),
}));

const holderDistribution = [
  { name: "Retail", value: 45 },
  { name: "Institutional", value: 30 },
  { name: "Team", value: 15 },
  { name: "Treasury", value: 10 },
];

const recentTransactions = [
  {
    hash: "5UwP...3nKm",
    type: "Transfer",
    amount: "1,000",
    from: "DK8H...9xQn",
    to: "4nJN...mK2P",
    time: "2 mins ago",
  },
  {
    hash: "7RtK...2vNp",
    type: "Mint",
    amount: "5,000",
    from: "System",
    to: "9pLM...5hQw",
    time: "5 mins ago",
  },
  {
    hash: "3YqL...8mBx",
    type: "Burn",
    amount: "2,500",
    from: "6kNP...1jRs",
    to: "System",
    time: "10 mins ago",
  },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

export default function DashboardPage() {
  const [totalSupply, setTotalSupply] = useState("1,000,000");
  const [circulatingSupply, setCirculatingSupply] = useState("750,000");
  const [holders, setHolders] = useState("573");
  const [volume24h, setVolume24h] = useState("125,000");

  return (
    <div className="min-h-screen bg-gradient-green-soft">
      <div className="p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800">
              Analytics Dashboard
            </h1>
            <p className="text-green-600 mt-1">
              Monitor your asset performance and metrics
            </p>
          </div>
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            Devnet
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-white border-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                Total Supply
              </CardTitle>
              <Coins className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {totalSupply}
              </div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
                Max Supply: 2,000,000
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                Circulating Supply
              </CardTitle>
              <Wallet className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {circulatingSupply}
              </div>
              <div className="flex items-center text-xs text-green-600">
                75% of total supply
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                Total Holders
              </CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{holders}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                +12 in last 24h
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                24h Volume
              </CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {volume24h}
              </div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
                +15.9% from yesterday
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-7 mb-8">
          <Card className="md:col-span-4 bg-white border-green-100">
            <CardHeader>
              <CardTitle className="text-green-800">
                Trading Volume (24h)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeData}>
                  <defs>
                    <linearGradient
                      id="volumeGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-green-100"
                  />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(hour) => `${hour}:00`}
                    className="text-green-600"
                  />
                  <YAxis className="text-green-600" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="volume"
                    stroke="hsl(var(--chart-1))"
                    fill="url(#volumeGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 bg-white border-green-100">
            <CardHeader>
              <CardTitle className="text-green-800">
                Holder Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={holderDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {holderDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {holderDistribution.map((item, index) => (
                  <div key={item.name} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <div className="space-x-2 text-green-800">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm text-green-600">
                        {item.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-green-100">
          <CardHeader>
            <CardTitle className="text-green-800">
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-green-600">
              Latest token transfers and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-green-50">
                  <TableHead className="text-green-800">Hash</TableHead>
                  <TableHead className="text-green-800">Type</TableHead>
                  <TableHead className="text-green-800">Amount</TableHead>
                  <TableHead className="text-green-800">From</TableHead>
                  <TableHead className="text-green-800">To</TableHead>
                  <TableHead className="text-green-800">Time</TableHead>
                  <TableHead className="text-green-800">Explorer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((tx) => (
                  <TableRow key={tx.hash} className="hover:bg-green-50">
                    <TableCell className="font-mono text-green-800">
                      {tx.hash}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-green-800">
                      {tx.amount}
                    </TableCell>
                    <TableCell className="font-mono text-green-700">
                      {tx.from}
                    </TableCell>
                    <TableCell className="font-mono text-green-700">
                      {tx.to}
                    </TableCell>
                    <TableCell className="text-green-600">{tx.time}</TableCell>
                    <TableCell>
                      <a
                        href={`https://explorer.solana.com/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-green-600 hover:text-green-700"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </a>
                    </TableCell>
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
