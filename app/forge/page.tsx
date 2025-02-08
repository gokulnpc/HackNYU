"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
} from "lucide-react";

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
    setIsSubmitting(true);
    try {
      // TODO: Implement actual asset creation
      console.log(data);
      toast({
        title: "Asset Created",
        description: `Successfully created ${data.name} (${data.code})`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create asset. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Forge New Asset</h1>
        <Badge variant="secondary">Beta</Badge>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
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
                      <FormDescription>
                        The full name of your asset
                      </FormDescription>
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
                      <FormDescription>
                        A unique identifier for your asset (uppercase letters
                        and numbers only)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select asset type" />
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
                      <FormDescription>
                        The type determines how your asset will be regulated
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Supply Configuration
                </CardTitle>
                <CardDescription>
                  Set the initial and maximum supply for your asset
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                      <FormDescription>
                        The amount of tokens to create initially
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supply Limit (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="e.g., 21000000"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of tokens that can ever exist
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LockIcon className="h-5 w-5" />
                Authorization Controls
              </CardTitle>
              <CardDescription>
                Configure compliance and security features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="authorizeRequired"
                render={({ field }) => (
                  <div className="flex items-center justify-between space-x-4">
                    <div className="space-y-0.5">
                      <FormLabel>Authorization Required</FormLabel>
                      <FormDescription>
                        Require approval before accounts can hold this asset
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="freezeEnabled"
                render={({ field }) => (
                  <div className="flex items-center justify-between space-x-4">
                    <div className="space-y-0.5">
                      <FormLabel>Enable Freeze</FormLabel>
                      <FormDescription>
                        Allow freezing of individual account balances
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="clawbackEnabled"
                render={({ field }) => (
                  <div className="flex items-center justify-between space-x-4">
                    <div className="space-y-0.5">
                      <FormLabel>Enable Clawback</FormLabel>
                      <FormDescription>
                        Allow recovery of tokens from accounts (requires freeze)
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!form.watch("freezeEnabled")}
                      />
                    </FormControl>
                  </div>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="regulated"
                render={({ field }) => (
                  <div className="flex items-center justify-between space-x-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <FormLabel>Regulated Asset</FormLabel>
                        <Badge variant="outline">Coming Soon</Badge>
                      </div>
                      <FormDescription>
                        Enable SEP-8 regulated asset controls
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={true}
                      />
                    </FormControl>
                  </div>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex items-center gap-4">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Creating Asset..." : "Create Asset"}
            </Button>
            <Button type="reset" variant="outline" size="lg">
              Reset Form
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
