"use client";

import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityData {
    time: string;
    amount: number;
    type: "mint" | "burn";
}

interface ActivityChartProps {
    data: ActivityData[];
    assetCode: string;
}

export function ActivityChart({ data, assetCode }: ActivityChartProps) {
    const formatXAxis = (time: string) => {
        return time;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-medium">{`Time: ${label}`}</p>
                    <p className="text-sm text-muted-foreground">
                        {`${data.type === "mint" ? "Minted" : "Burned"}: ${Math.abs(data.amount)} ${assetCode}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Mint/Burn Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="time"
                                tickFormatter={formatXAxis}
                                className="text-xs"
                            />
                            <YAxis className="text-xs" />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}