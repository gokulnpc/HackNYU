"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PublicKey } from "@solana/web3.js";
import { getSolanaService } from "../../lib/services/solana";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Coins,
  Shield,
  AlertTriangle,
  LockIcon,
  Undo2,
  Info,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(1, "Asset name is required").max(50),
  code: z
    .string()
    .min(1, "Asset code is required")
    .max(12)
    .regex(/^[A-Z0-9]+$/, "Code must be uppercase letters and numbers only"),
  type: z.enum(["Payment Token", "Security Token", "Utility Token"]),
  initialSupply: z.string().regex(/^\d+$/, "Must be a valid number"),
  limit: z.string().regex(/^\d*$/, "Must be a valid number").optional(),
  authorizeRequired: z.boolean().default(false),
  freezeEnabled: z.boolean().default(false),
  clawbackEnabled: z.boolean().default(false),
  regulated: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const wallet = useWallet();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      authorizeRequired: false,
      freezeEnabled: false,
      clawbackEnabled: false,
      regulated: false,
    },
  });

  async function onSubmit(data: FormValues) {
    if (!wallet.publicKey) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create an asset.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const solanaService = getSolanaService(wallet);

      const tx = await solanaService.createAsset({
        name: data.name,
        code: data.code,
        assetType: data.type,
        decimals: 6,
        initialSupply: parseInt(data.initialSupply),
        limit: data.limit ? parseInt(data.limit) : undefined,
        authorizeRequired: data.authorizeRequired,
        freezeEnabled: data.freezeEnabled,
        clawbackEnabled: data.clawbackEnabled,
        regulated: data.regulated,
        owner: wallet.publicKey,
      });

      toast({
        title: "Asset Created Successfully",
        description: `${data.name} (${
          data.code
        }) has been created. Transaction: ${tx.slice(0, 8)}...`,
      });

      form.reset();
    } catch (error) {
      console.error("Error creating asset:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create asset. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-green-soft">
      <div className="p-8 max-w-[1400px] mx-auto">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-6 text-green-700 hover:text-green-800 hover:bg-green-100"
        >
          <Link href="/assets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assets
          </Link>
        </Button>

        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-green-800">Forge New Asset</h1>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Beta
          </Badge>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-green-100 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Coins className="h-5 w-5 text-green-600" />
                    Basic Information
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Configure the core properties of your asset
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700">
                          Asset Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., My Token"
                            {...field}
                            className="border-green-100 bg-white text-green-800 placeholder:text-green-400 focus:border-green-500 hover:border-green-200"
                          />
                        </FormControl>
                        <FormDescription className="text-green-600">
                          The full name of your asset
                        </FormDescription>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700">
                          Asset Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., TKN"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                            className="border-green-100 bg-white text-green-800 placeholder:text-green-400 focus:border-green-500 hover:border-green-200"
                          />
                        </FormControl>
                        <FormDescription className="text-green-600">
                          A unique identifier for your asset (uppercase letters
                          and numbers only)
                        </FormDescription>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700">
                          Asset Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-green-100 bg-white text-green-800 focus:border-green-500 hover:border-green-200">
                              <SelectValue
                                placeholder="Select asset type"
                                className="text-green-800 placeholder:text-green-400"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Payment Token">
                              Payment Token
                            </SelectItem>
                            <SelectItem value="Security Token">
                              Security Token
                            </SelectItem>
                            <SelectItem value="Utility Token">
                              Utility Token
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-green-600">
                          The type determines how your asset will be regulated
                        </FormDescription>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-green-100 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Shield className="h-5 w-5 text-green-600" />
                    Supply Configuration
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Set the initial and maximum supply for your asset
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="initialSupply"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700">
                          Initial Supply
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="e.g., 1000000"
                            {...field}
                            className="border-green-100 bg-white text-green-800 placeholder:text-green-400 focus:border-green-500 hover:border-green-200"
                          />
                        </FormControl>
                        <FormDescription className="text-green-600">
                          The amount of tokens to create initially
                        </FormDescription>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700">
                          Supply Limit (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="e.g., 21000000"
                            {...field}
                            className="border-green-100 bg-white text-green-800 placeholder:text-green-400 focus:border-green-500 hover:border-green-200"
                          />
                        </FormControl>
                        <FormDescription className="text-green-600">
                          Maximum number of tokens that can ever exist
                        </FormDescription>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="border-green-100 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <LockIcon className="h-5 w-5 text-green-600" />
                  Authorization Controls
                </CardTitle>
                <CardDescription className="text-green-600">
                  Configure compliance and security features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="authorizeRequired"
                  render={({ field }) => (
                    <div className="flex items-center justify-between space-x-4 p-4 rounded-lg bg-green-50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-green-700">
                          Authorization Required
                        </FormLabel>
                        <FormDescription className="text-green-600">
                          Require approval before accounts can hold this asset
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-green-600"
                        />
                      </FormControl>
                    </div>
                  )}
                />

                <Separator className="bg-green-100" />

                <FormField
                  control={form.control}
                  name="freezeEnabled"
                  render={({ field }) => (
                    <div className="flex items-center justify-between space-x-4 p-4 rounded-lg bg-green-50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-green-700">
                          Enable Freeze
                        </FormLabel>
                        <FormDescription className="text-green-600">
                          Allow freezing of individual account balances
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-green-600"
                        />
                      </FormControl>
                    </div>
                  )}
                />

                <Separator className="bg-green-100" />

                <FormField
                  control={form.control}
                  name="clawbackEnabled"
                  render={({ field }) => (
                    <div className="flex items-center justify-between space-x-4 p-4 rounded-lg bg-green-50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-green-700">
                          Enable Clawback
                        </FormLabel>
                        <FormDescription className="text-green-600">
                          Allow recovery of tokens from accounts (requires
                          freeze)
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!form.watch("freezeEnabled")}
                          className="data-[state=checked]:bg-green-600"
                        />
                      </FormControl>
                    </div>
                  )}
                />

                <Separator className="bg-green-100" />

                <FormField
                  control={form.control}
                  name="regulated"
                  render={({ field }) => (
                    <div className="flex items-center justify-between space-x-4 p-4 rounded-lg bg-green-50">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <FormLabel className="text-green-700">
                            Regulated Asset
                          </FormLabel>
                          <Badge
                            variant="outline"
                            className="border-green-200 text-green-700"
                          >
                            Coming Soon
                          </Badge>
                        </div>
                        <FormDescription className="text-green-600">
                          Enable SEP-8 regulated asset controls
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={true}
                          className="data-[state=checked]:bg-green-600"
                        />
                      </FormControl>
                    </div>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="bg-gradient-green hover:opacity-90 transition-opacity"
              >
                {isSubmitting ? "Creating Asset..." : "Create Asset"}
              </Button>
              <Button
                type="reset"
                variant="outline"
                size="lg"
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                Reset Form
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
