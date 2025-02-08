"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useWallet } from "@solana/wallet-adapter-react";
import { getSolanaService } from "@/lib/services/solana"; // Import function
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Coins, Shield } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Asset name is required").max(50),
  code: z
    .string()
    .min(1, "Asset code is required")
    .max(12)
    .regex(/^[A-Z0-9]+$/, "Code must be uppercase letters and numbers only"),
  type: z.enum(["Payment Token", "Security Token", "Utility Token"]),
  initialSupply: z.string().regex(/^\d+$/, "Must be a valid number"),
  freezeEnabled: z.boolean().default(false),
  clawbackEnabled: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { publicKey, wallet } = useWallet();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      freezeEnabled: false,
      clawbackEnabled: false,
    },
  });

  async function onSubmit(data: FormValues) {
    if (!publicKey || !wallet) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const solanaService = getSolanaService(wallet); // Initialize service with wallet

      const tx = await solanaService.createAsset(
        data.name,
        data.code,
        9, // Fixed 9 decimals
        parseInt(data.initialSupply),
        publicKey
      );

      toast({
        title: "Asset Created Successfully",
        description: `Transaction: ${tx}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create asset. Please try again.",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Forge New Asset</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Configure the core properties of your asset
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., My Token" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., TKN"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="initialSupply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Supply</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g., 1000000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Asset"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
