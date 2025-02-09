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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  Plus,
} from "lucide-react";

// Mock data remains the same
const teamMembers = [
  { id: "1764", member: "Gokul", role: "ADMINISTRATOR" },
  { id: "1719", member: "Kevin", role: "ADMINISTRATOR" },
  { id: "1750", member: "Divyansh", role: "User" },
  { id: "1845", member: "Adithyah", role: "User" },
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
  { name: "User", canModify: true },
];

const transactions = [
  {
    type: "Change trustline",
    date: "02/07/25, 09:38 PM",
    fee: "0.00004 SOL",
    feeUsd: "$0.0000133",
  },
  {
    type: "Account created",
    date: "02/07/25, 09:15 PM",
    fee: "0.00004 SOL",
    feeUsd: "$0.0000133",
  },
  {
    type: "Minted",
    date: "02/07/25, 12:23 AM",
    fee: "0.00002 SOL",
    feeUsd: "$0.0000066",
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("team");

  return (
    <div className="min-h-screen bg-gradient-green-soft">
      <div className="p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800">
              Administration
            </h1>
            <p className="text-green-600 mt-1">
              Manage team members and system settings
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="bg-green-50 p-1">
              <TabsTrigger
                value="team"
                className="data-[state=active]:bg-white data-[state=active]:text-green-800"
              >
                <Users className="h-4 w-4 mr-2" />
                Team Members
              </TabsTrigger>
              <TabsTrigger
                value="permissions"
                className="data-[state=active]:bg-white data-[state=active]:text-green-800"
              >
                <Shield className="h-4 w-4 mr-2" />
                Role Permissions
              </TabsTrigger>
              <TabsTrigger
                value="roles"
                className="data-[state=active]:bg-white data-[state=active]:text-green-800"
              >
                <UserCog className="h-4 w-4 mr-2" />
                Roles
              </TabsTrigger>
              <TabsTrigger
                value="expenses"
                className="data-[state=active]:bg-white data-[state=active]:text-green-800"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Operating Expenses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="team">
              <Card className="bg-white border-green-100">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-green-800">
                        Team Members
                      </CardTitle>
                      <CardDescription className="text-green-600">
                        Manage your team members and their roles
                      </CardDescription>
                    </div>
                    <Button className="bg-gradient-green hover:opacity-90 transition-opacity gap-2">
                      <Plus className="h-4 w-4" />
                      Add Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-green-50">
                        <TableHead className="text-green-800">ID</TableHead>
                        <TableHead className="text-green-800">MEMBER</TableHead>
                        <TableHead className="text-green-800">ROLE</TableHead>
                        <TableHead className="text-green-800">
                          ACTIONS
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member) => (
                        <TableRow key={member.id} className="hover:bg-green-50">
                          <TableCell className="font-medium text-green-800">
                            {member.id}
                          </TableCell>
                          <TableCell className="text-green-700">
                            {member.member}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 border-green-200"
                            >
                              {member.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-100"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions">
              <Card className="bg-white border-green-100">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-green-800">
                        Permissions
                      </CardTitle>
                      <CardDescription className="text-green-600">
                        You are only able to modify roles that you have created
                      </CardDescription>
                    </div>
                    <Button className="bg-gradient-green hover:opacity-90 transition-opacity">
                      Save changes
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-green-50">
                        <TableHead className="text-green-800">
                          ROLE NAME
                        </TableHead>
                        <TableHead className="text-green-800">
                          ADMIN 😊
                        </TableHead>
                        <TableHead className="text-green-800">
                          ADMINISTRATOR
                        </TableHead>
                        <TableHead className="text-green-800">
                          MANAGER
                        </TableHead>
                        <TableHead className="text-green-800">
                          OPERATOR
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rolePermissions.map((permission) => (
                        <TableRow
                          key={permission.name}
                          className="hover:bg-green-50"
                        >
                          <TableCell className="font-medium text-green-800">
                            {permission.name}
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={permission.admin}
                              className="border-green-200 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={permission.administrator}
                              className="border-green-200 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={permission.manager}
                              className="border-green-200 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={permission.operator}
                              className="border-green-200 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roles">
              <Card className="bg-white border-green-100">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-green-800">Roles</CardTitle>
                      <CardDescription className="text-green-600">
                        You are only able to modify roles that you have created
                      </CardDescription>
                    </div>
                    <Button className="bg-gradient-green hover:opacity-90 transition-opacity gap-2">
                      <Plus className="h-4 w-4" />
                      Create role
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-green-50">
                        <TableHead className="text-green-800">
                          ROLE NAME
                        </TableHead>
                        <TableHead className="text-right text-green-800">
                          ACTIONS
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roles.map((role) => (
                        <TableRow key={role.name} className="hover:bg-green-50">
                          <TableCell className="font-medium text-green-800">
                            {role.name}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-100"
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Rename
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-100"
                            >
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
              <Card className="bg-white border-green-100">
                <CardHeader>
                  <CardTitle className="text-green-800">
                    Sandbox Expenses Account
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Cost of the last 100 transactions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-green-800">
                        0.00457 SOL
                      </span>
                      <RefreshCw className="h-4 w-4 text-green-600" />
                      <span className="text-xl font-bold text-green-800">
                        $0.001518
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-green-800 mb-4">
                      Transaction history
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-green-50">
                          <TableHead className="text-green-800">
                            TRANSACTION
                          </TableHead>
                          <TableHead className="text-green-800">DATE</TableHead>
                          <TableHead className="text-green-800">
                            COVERED FEE (SOL)
                          </TableHead>
                          <TableHead className="text-green-800">
                            COVERED FEE (USD)
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((tx, index) => (
                          <TableRow key={index} className="hover:bg-green-50">
                            <TableCell className="font-medium text-green-800">
                              {tx.type}
                            </TableCell>
                            <TableCell className="text-green-700">
                              {tx.date}
                            </TableCell>
                            <TableCell className="font-mono text-green-700">
                              {tx.fee}
                            </TableCell>
                            <TableCell className="font-mono text-green-700">
                              {tx.feeUsd}
                            </TableCell>
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
      </div>
    </div>
  );
}
