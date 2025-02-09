"use client";

import { useState } from "react";
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
    Users,
    Shield,
    UserCog,
    DollarSign,
    Pencil,
    Trash2,
    RefreshCw,
} from "lucide-react";

// Mock data
const teamMembers = [
    { id: "1764", member: "34242", role: "ADMINISTRATOR" },
    { id: "1719", member: "Aakash R.", role: "ADMINISTRATOR" },
    { id: "1750", member: "Aaron S.", role: "Jefe" },
    { id: "1845", member: "Abdulrasheed", role: "Jefe" },
    { id: "1827", member: "Abinash", role: "Jefe" },
];

const rolePermissions = [
    {
        name: "Manage users and roles",
        admin: true,
        administrator: true,
        manager: true,
        operator: true,
    },
    {
        name: "Token management",
        admin: true,
        administrator: true,
        manager: true,
        operator: false,
    },
    {
        name: "Transfer internally",
        admin: true,
        administrator: true,
        manager: true,
        operator: true,
    },
    {
        name: "Transfer externally",
        admin: true,
        administrator: true,
        manager: false,
        operator: false,
    },
];

const roles = [
    { name: "Administrator 😊", canModify: true },
    { name: "ADMINISTRATOR", canModify: true },
    { name: "GERENTE ADMINISTATIVO", canModify: true },
    { name: "Gerente de Operações", canModify: true },
    { name: "Jefe", canModify: true },
];

const transactions = [
    {
        type: "Change trustline",
        date: "02/07/25, 09:38 PM",
        fee: "0.00004 XLM",
        feeUsd: "$0.0000133",
    },
    {
        type: "Account created",
        date: "02/07/25, 09:15 PM",
        fee: "0.00004 XLM",
        feeUsd: "$0.0000133",
    },
    {
        type: "Minted",
        date: "02/07/25, 12:23 AM",
        fee: "0.00002 XLM",
        feeUsd: "$0.0000066",
    },
];

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("team");

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Administration</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                    <TabsTrigger value="team" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Team Members
                    </TabsTrigger>
                    <TabsTrigger value="permissions" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Role Permissions
                    </TabsTrigger>
                    <TabsTrigger value="roles" className="flex items-center gap-2">
                        <UserCog className="h-4 w-4" />
                        Roles
                    </TabsTrigger>
                    <TabsTrigger value="expenses" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Operating Expenses
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="team">
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Members</CardTitle>
                            <CardDescription>Manage your team members and their roles</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>MEMBER</TableHead>
                                        <TableHead>ROLE</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teamMembers.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell>{member.id}</TableCell>
                                            <TableCell>{member.member}</TableCell>
                                            <TableCell>{member.role}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="permissions">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Permissions</CardTitle>
                                    <CardDescription>
                                        You are only able to modify roles that you have created.
                                    </CardDescription>
                                </div>
                                <Button>Save changes</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ROLE NAME</TableHead>
                                        <TableHead>ADMIN 😊</TableHead>
                                        <TableHead>ADMINISTRATOR</TableHead>
                                        <TableHead>MANAGER</TableHead>
                                        <TableHead>OPERATOR</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rolePermissions.map((permission) => (
                                        <TableRow key={permission.name}>
                                            <TableCell>{permission.name}</TableCell>
                                            <TableCell>
                                                <Checkbox checked={permission.admin} />
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox checked={permission.administrator} />
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox checked={permission.manager} />
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox checked={permission.operator} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="roles">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Roles</CardTitle>
                                    <CardDescription>
                                        You are only able to modify roles that you have created.
                                    </CardDescription>
                                </div>
                                <Button>Create role</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ROLE NAME</TableHead>
                                        <TableHead className="text-right">ACTIONS</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.map((role) => (
                                        <TableRow key={role.name}>
                                            <TableCell>{role.name}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Rename
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-destructive">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="expenses">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sandbox Expenses Account</CardTitle>
                            <CardDescription>
                                Cost of the last 100 transactions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                                <div className="flex items-center gap-4">
                                    <span className="text-xl font-bold">0.00457 XLM</span>
                                    <RefreshCw className="h-4 w-4" />
                                    <span className="text-xl font-bold">$0.001518</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch id="soroban" />
                                    <label htmlFor="soroban">Include Soroban Transactions</label>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Transaction history</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>TRANSACTION</TableHead>
                                            <TableHead>DATE</TableHead>
                                            <TableHead>COVERED FEE (XLM)</TableHead>
                                            <TableHead>COVERED FEE (USD)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions.map((tx, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{tx.type}</TableCell>
                                                <TableCell>{tx.date}</TableCell>
                                                <TableCell>{tx.fee}</TableCell>
                                                <TableCell>{tx.feeUsd}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}