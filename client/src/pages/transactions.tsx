import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRight, Filter, Download, Eye, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Layout } from "@/components/layout/Layout";
import type { Transaction } from "@shared/schema";

const getRiskBadgeColor = (score: number) => {
  if (score >= 80) return "destructive";
  if (score >= 60) return "secondary";
  if (score >= 40) return "outline";
  return "default";
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved": return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "rejected": return <XCircle className="w-4 h-4 text-red-500" />;
    case "flagged": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    default: return <Clock className="w-4 h-4 text-blue-500" />;
  }
};

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions", { search: searchQuery, status: statusFilter, risk: riskFilter }],
  });

  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = !searchQuery || 
      transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    const matchesRisk = riskFilter === "all" || 
      (riskFilter === "high" && transaction.riskScore >= 70) ||
      (riskFilter === "medium" && transaction.riskScore >= 40 && transaction.riskScore < 70) ||
      (riskFilter === "low" && transaction.riskScore < 40);
    
    return matchesSearch && matchesStatus && matchesRisk;
  }) || [];

  const totalAmount = filteredTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  const flaggedCount = filteredTransactions.filter(tx => tx.status === "flagged").length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" data-testid="button-export">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-transactions">
                {filteredTransactions.length.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-amount">
                ${totalAmount.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600" data-testid="stat-flagged">
                {flaggedCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600" data-testid="stat-high-risk">
                {filteredTransactions.filter(tx => tx.riskScore >= 70).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <Input
                  placeholder="Search customers, IDs, descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Risk Level</label>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger data-testid="select-risk">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="high">High Risk (70+)</SelectItem>
                    <SelectItem value="medium">Medium Risk (40-69)</SelectItem>
                    <SelectItem value="low">Low Risk (&lt;40)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} data-testid={`transaction-${transaction.id}`}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.customerName}</div>
                          <div className="text-sm text-muted-foreground">{transaction.customerId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${parseFloat(transaction.amount).toLocaleString()} {transaction.currency}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.transactionType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRiskBadgeColor(transaction.riskScore)}>
                          {transaction.riskScore}/100
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transaction.status)}
                          <span className="capitalize">{transaction.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.createdAt!).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" data-testid={`button-view-${transaction.id}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}