import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Key, Plus, Copy, Eye, EyeOff, RotateCcw, Trash2, ToggleLeft, ToggleRight, Activity, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ApiKey } from "@shared/schema";

export default function ApiManagementPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnvironment, setNewKeyEnvironment] = useState("development");
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: apiKeys, isLoading } = useQuery<ApiKey[]>({
    queryKey: ["/api/api-keys"],
  });

  const createKeyMutation = useMutation({
    mutationFn: (data: { name: string; environment: string }) =>
      apiRequest("POST", "/api/api-keys", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/api-keys"] });
      setIsCreateDialogOpen(false);
      setNewKeyName("");
      setNewKeyEnvironment("development");
      toast({
        title: "Success",
        description: "API key created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    },
  });

  const toggleKeyMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiRequest("PATCH", `/api/api-keys/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/api-keys"] });
      toast({
        title: "Success",
        description: "API key status updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update API key status",
        variant: "destructive",
      });
    },
  });

  const deleteKeyMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/api-keys/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/api-keys"] });
      toast({
        title: "Success",
        description: "API key deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
    },
  });

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key",
        variant: "destructive",
      });
      return;
    }

    createKeyMutation.mutate({
      name: newKeyName.trim(),
      environment: newKeyEnvironment,
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "API key copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const activeKeys = apiKeys?.filter(key => key.isActive).length || 0;
  const productionKeys = apiKeys?.filter(key => key.environment === "production").length || 0;
  const totalUsage = apiKeys?.reduce((sum, key) => sum + (key.usageCount || 0), 0) || 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Management</h1>
            <p className="text-muted-foreground">Create and manage API keys for AML services</p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-create-api-key">
                  <Plus className="w-4 h-4 mr-2" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    Generate a new API key for accessing AML services.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="key-name">Key Name</Label>
                    <Input
                      id="key-name"
                      placeholder="My AML Integration"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      data-testid="input-key-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="environment">Environment</Label>
                    <Select value={newKeyEnvironment} onValueChange={setNewKeyEnvironment}>
                      <SelectTrigger data-testid="select-environment">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateKey}
                    disabled={createKeyMutation.isPending}
                    data-testid="button-confirm-create"
                  >
                    {createKeyMutation.isPending ? "Creating..." : "Create Key"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-keys">
                {apiKeys?.length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600" data-testid="stat-active-keys">
                {activeKeys}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Production Keys</CardTitle>
              <Key className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600" data-testid="stat-production-keys">
                {productionKeys}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600" data-testid="stat-total-usage">
                {totalUsage.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Keys Table */}
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage your API keys for AML service integration</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key Preview</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading API keys...
                    </TableCell>
                  </TableRow>
                ) : (apiKeys?.length || 0) === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No API keys found. Create your first API key to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  apiKeys?.map((apiKey) => (
                    <TableRow key={apiKey.id} data-testid={`api-key-${apiKey.id}`}>
                      <TableCell className="font-medium">
                        {apiKey.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                            {visibleKeys.has(apiKey.id) ? apiKey.keyHash : apiKey.keyPreview}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            data-testid={`button-toggle-visibility-${apiKey.id}`}
                          >
                            {visibleKeys.has(apiKey.id) ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.keyHash)}
                            data-testid={`button-copy-${apiKey.id}`}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={apiKey.environment === "production" ? "destructive" : "default"}>
                          {apiKey.environment}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyMutation.mutate({
                              id: apiKey.id,
                              isActive: !apiKey.isActive
                            })}
                            disabled={toggleKeyMutation.isPending}
                            data-testid={`button-toggle-${apiKey.id}`}
                          >
                            {apiKey.isActive ? (
                              <ToggleRight className="w-5 h-5 text-green-500" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-gray-400" />
                            )}
                          </Button>
                          <span className={apiKey.isActive ? "text-green-600" : "text-gray-500"}>
                            {apiKey.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{(apiKey.usageCount || 0).toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        {apiKey.lastUsed ? (
                          new Date(apiKey.lastUsed).toLocaleDateString()
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(apiKey.createdAt!).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-rotate-${apiKey.id}`}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteKeyMutation.mutate(apiKey.id)}
                            disabled={deleteKeyMutation.isPending}
                            data-testid={`button-delete-${apiKey.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
            <CardDescription>Available AML API endpoints for integration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">POST</Badge>
                    <code className="font-mono text-sm">/v1/check</code>
                  </div>
                  <Badge variant="secondary">Risk Assessment</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Check wallet addresses for risk factors and sanctions without broadcasting transactions.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">POST</Badge>
                    <code className="font-mono text-sm">/v1/relay</code>
                  </div>
                  <Badge variant="secondary">Transaction Relay</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Submit raw transactions for risk assessment and conditional broadcasting.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">POST</Badge>
                    <code className="font-mono text-sm">/v1/wallet-risk</code>
                  </div>
                  <Badge variant="secondary">Wallet Analysis</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Comprehensive wallet risk assessment using multiple data sources.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">POST</Badge>
                    <code className="font-mono text-sm">/v1/sanctions/manage</code>
                  </div>
                  <Badge variant="secondary">Sanctions Management</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add or remove addresses from custom sanctions lists.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}