import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertAlertSchema, insertCaseSchema, insertApiKeySchema, insertComplianceReportSchema, insertSanctionedWalletSchema, insertBillingHistorySchema, insertSubscriptionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Metrics endpoint
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await storage.getMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // Transactions endpoints
  app.get("/api/transactions/recent", async (req, res) => {
    try {
      const transactions = await storage.getRecentTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent transactions" });
    }
  });

  app.get("/api/transactions/filtered", async (req, res) => {
    try {
      const { dateRange, riskLevel, country, transactionType } = req.query;
      const filters = {
        dateRange: dateRange as string,
        riskLevel: riskLevel as string,
        country: country as string,
        transactionType: transactionType as string,
      };
      const transactions = await storage.getFilteredTransactions(filters);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch filtered transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create transaction" });
      }
    }
  });

  // Alerts endpoints
  app.get("/api/alerts/critical", async (req, res) => {
    try {
      const alerts = await storage.getCriticalAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch critical alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid alert data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create alert" });
      }
    }
  });

  // Cases endpoints
  app.get("/api/cases", async (req, res) => {
    try {
      const cases = await storage.getCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cases" });
    }
  });

  app.post("/api/cases", async (req, res) => {
    try {
      const validatedData = insertCaseSchema.parse(req.body);
      const caseItem = await storage.createCase(validatedData);
      res.status(201).json(caseItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid case data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create case" });
      }
    }
  });

  // API Keys endpoints
  app.get("/api/api-keys", async (req, res) => {
    try {
      const apiKeys = await storage.getApiKeys();
      res.json(apiKeys);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch API keys" });
    }
  });

  app.post("/api/api-keys", async (req, res) => {
    try {
      const validatedData = insertApiKeySchema.parse(req.body);
      const apiKey = await storage.createApiKey(validatedData);
      res.status(201).json(apiKey);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid API key data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create API key" });
      }
    }
  });

  app.patch("/api/api-keys/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      await storage.updateApiKey(id, { isActive });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update API key" });
    }
  });

  app.delete("/api/api-keys/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteApiKey(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete API key" });
    }
  });

  // API Usage endpoint
  app.get("/api/api-usage", async (req, res) => {
    try {
      const usage = await storage.getApiUsage();
      res.json(usage);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch API usage" });
    }
  });

  // Reports endpoints
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertComplianceReportSchema.parse(req.body);
      const report = await storage.createReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid report data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create report" });
      }
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/risk-trends", async (req, res) => {
    try {
      const trends = await storage.getRiskTrends();
      res.json(trends);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch risk trends" });
    }
  });

  app.get("/api/analytics/geographic-risk", async (req, res) => {
    try {
      const geoData = await storage.getGeographicRiskData();
      res.json(geoData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch geographic risk data" });
    }
  });

  // Billing endpoint
  app.get("/api/billing", async (req, res) => {
    try {
      const billing = await storage.getBillingData();
      res.json(billing);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch billing data" });
    }
  });

  // Sanctioned Wallets endpoints
  app.get("/api/sanctioned-wallets", async (req, res) => {
    try {
      const { search, source } = req.query;
      const filters = { search: search as string, source: source as string };
      const wallets = await storage.getSanctionedWallets(filters);
      res.json(wallets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sanctioned wallets" });
    }
  });

  app.post("/api/sanctioned-wallets", async (req, res) => {
    try {
      const validatedData = insertSanctionedWalletSchema.parse(req.body);
      const wallet = await storage.createSanctionedWallet(validatedData);
      res.status(201).json(wallet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid wallet data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to add sanctioned wallet" });
      }
    }
  });

  app.delete("/api/sanctioned-wallets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSanctionedWallet(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete sanctioned wallet" });
    }
  });

  // PEP Profiles endpoint
  app.get("/api/pep-profiles", async (req, res) => {
    try {
      const profiles = await storage.getPepProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch PEP profiles" });
    }
  });

  // Alerts endpoints (additional)
  app.get("/api/alerts", async (req, res) => {
    try {
      const { status, severity, dateRange } = req.query;
      const filters = {
        status: status as string,
        severity: severity as string,
        dateRange: dateRange as string,
      };
      const alerts = await storage.getAlerts(filters);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.patch("/api/alerts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { isResolved, assignedTo } = req.body;
      await storage.updateAlert(id, { isResolved, assignedTo });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update alert" });
    }
  });

  // Cases endpoints (additional)
  app.patch("/api/cases/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      await storage.updateCase(id, updates);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update case" });
    }
  });

  // Transactions endpoints (additional)
  app.get("/api/transactions", async (req, res) => {
    try {
      const { page = 1, pageSize = 50, ...filters } = req.query;
      const transactions = await storage.getTransactions({
        page: parseInt(page as string),
        pageSize: parseInt(pageSize as string),
        ...filters,
      });
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Billing endpoints
  app.get("/api/billing-history", async (req, res) => {
    try {
      const history = await storage.getBillingHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch billing history" });
    }
  });

  app.get("/api/subscription", async (req, res) => {
    try {
      const subscription = await storage.getSubscription();
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  // Profile endpoints
  app.get("/api/profile/developer", async (req, res) => {
    try {
      const profile = await storage.getDeveloperProfile();
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch developer profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
