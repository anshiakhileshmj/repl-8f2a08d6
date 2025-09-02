# AML (Anti-Money Laundering) Developer Dashboard
## Complete Feature Documentation & Backend Requirements

---

## Table of Contents
1. [Overview](#overview)
2. [Authentication System](#authentication-system)
3. [Dashboard & Real-time Monitoring](#dashboard--real-time-monitoring)
4. [Transaction Management](#transaction-management)
5. [Alert System](#alert-system)
6. [Case Management](#case-management)
7. [Sanctions Screening](#sanctions-screening)
8. [API Key Management](#api-key-management)
9. [Settings & Configuration](#settings--configuration)
10. [Advanced Filtering & Search](#advanced-filtering--search)
11. [Risk Assessment Engine](#risk-assessment-engine)
12. [Compliance Reporting](#compliance-reporting)
13. [Database Schema](#database-schema)
14. [Backend API Endpoints](#backend-api-endpoints)
15. [Real-time Features](#real-time-features)
16. [External Integrations](#external-integrations)

---

## Overview

The AML Developer Dashboard is a comprehensive compliance monitoring platform designed for fintechs, payment platforms, and financial institutions. It provides real-time transaction monitoring, risk assessment, sanctions screening, case management, and regulatory reporting capabilities through a modern React frontend with Express.js backend and PostgreSQL database.

### Core Capabilities
- **Real-time Transaction Monitoring** - Live transaction feeds with risk scoring
- **Multi-source Sanctions Screening** - OFAC, UN, EU sanctions list integration
- **PEP (Politically Exposed Person) Monitoring** - Automatic screening against global databases
- **Risk Assessment Engine** - Multi-factor risk calculation and pattern detection
- **Case Management System** - Investigation workflow with status tracking
- **Automated Compliance Reporting** - Regulatory report generation (SAR, CTR, etc.)
- **API Management Platform** - Full lifecycle API key management with usage analytics
- **Advanced Analytics** - Geographic risk heatmaps and trend analysis

---

## Authentication System

### Features
- **User Registration & Login** - Email/password authentication with validation
- **Session Management** - Express sessions with PostgreSQL session store
- **User Profile Management** - Comprehensive user data including business information
- **Two-Factor Authentication** - Optional 2FA for enhanced security
- **Account Verification** - Email and phone verification workflows

### User Data Fields
```typescript
interface User {
  id: string;
  username?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  department?: string;
  location?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
  profileImageUrl?: string;
  country?: string;
  businessType?: string;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Authentication Flow
1. **Sign Up** - User registration with email verification
2. **Sign In** - Email/password login with session creation
3. **Session Validation** - Middleware validates session on protected routes
4. **Logout** - Session termination and redirect to authentication page

---

## Dashboard & Real-time Monitoring

### Main Dashboard Components

#### 1. Key Metrics Cards
- **Total Transactions** - Real-time transaction count with trend indicators
- **Flagged Transactions** - Count of transactions requiring review
- **Active Alerts** - Number of unresolved compliance alerts
- **Risk Score Average** - Overall portfolio risk assessment
- **Monthly Volume** - Transaction volume with growth metrics

#### 2. Real-time Transaction Feed
- **Live Transaction Stream** - Continuously updating transaction list
- **Risk Score Indicators** - Color-coded risk levels (Low, Medium, High, Critical)
- **Transaction Details** - Customer info, amounts, types, timestamps
- **Status Tracking** - Pending, approved, flagged, rejected states
- **Interactive Elements** - Click to view detailed transaction information

#### 3. Critical Alerts Panel
- **Priority-based Alert Display** - Critical alerts shown prominently
- **Alert Categories** - Sanctions, PEP, unusual patterns, threshold breaches
- **Real-time Updates** - New alerts appear instantly
- **Assignment Tracking** - Shows which team member is handling each alert
- **Resolution Status** - Clear indication of resolved vs. open alerts

#### 4. Risk Analytics Chart
- **Trend Visualization** - Area charts showing risk patterns over time
- **Multi-level Risk Display** - Separate areas for low, medium, high risk transactions
- **Time Range Selection** - Daily, weekly, monthly, quarterly views
- **Interactive Tooltips** - Detailed information on hover
- **Data Export** - Chart data can be exported for reporting

#### 5. Geographic Risk Heatmap
- **World Map Visualization** - Geographic distribution of transaction risks
- **Risk Level Indicators** - Color-coded regions based on risk scores
- **Transaction Volume Overlay** - Size indicators for transaction volumes
- **Country-specific Data** - Detailed risk profiles by jurisdiction
- **Interactive Zoom** - Drill down into specific regions

---

## Transaction Management

### Core Features

#### 1. Transaction Listing & Filtering
- **Comprehensive Transaction Table** - All transactions with full details
- **Multi-criteria Search** - Search by customer name, ID, description
- **Status Filtering** - Filter by pending, approved, flagged, rejected
- **Risk Level Filtering** - High (70+), Medium (40-69), Low (<40)
- **Date Range Selection** - Custom date filtering
- **Real-time Updates** - Table updates as new transactions arrive

#### 2. Transaction Details
- **Customer Information** - Name, ID, contact details, risk profile
- **Transaction Data** - Amount, currency, type, source/destination countries
- **Risk Assessment** - Detailed risk score breakdown and factors
- **Status History** - Complete audit trail of status changes
- **Flagged Reasons** - Specific reasons for transaction flagging
- **Related Alerts** - Associated compliance alerts and cases

#### 3. Transaction Actions
- **Manual Review** - Compliance officers can review and approve/reject
- **Status Updates** - Change transaction status with reason codes
- **Flag Management** - Add or remove transaction flags
- **Case Creation** - Convert flagged transactions into investigation cases
- **Export Functionality** - Export transaction data for reporting

### Transaction Data Model
```typescript
interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: string;
  currency: string;
  riskScore: number;
  status: 'pending' | 'flagged' | 'approved' | 'rejected';
  transactionType: string;
  sourceCountry?: string;
  destinationCountry?: string;
  description?: string;
  flaggedReasons?: any[];
  createdAt: Date;
}
```

---

## Alert System

### Alert Types & Management

#### 1. Alert Categories
- **Sanctions Alerts** - Transactions involving sanctioned entities
- **PEP Alerts** - Transactions with politically exposed persons
- **Unusual Pattern Alerts** - Behavioral anomalies and suspicious patterns
- **Threshold Alerts** - Transactions exceeding defined limits

#### 2. Alert Severity Levels
- **Critical** - Immediate action required, potential regulatory violation
- **High** - Priority review needed within 24 hours
- **Medium** - Standard review timeline (2-3 business days)
- **Low** - Routine monitoring, can be batch processed

#### 3. Alert Management Features
- **Alert Assignment** - Assign alerts to specific compliance officers
- **Status Tracking** - Open, assigned, under review, resolved
- **Resolution Notes** - Document investigation findings and actions taken
- **Escalation Workflow** - Automatic escalation for unresolved alerts
- **Batch Operations** - Mark multiple alerts as resolved or assign in bulk

#### 4. Alert Data Structure
```typescript
interface Alert {
  id: string;
  transactionId?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  alertType: 'sanctions' | 'pep' | 'unusual_pattern' | 'threshold';
  isResolved: boolean;
  assignedTo?: string;
  createdAt: Date;
}
```

---

## Case Management

### Investigation Case System

#### 1. Case Creation & Management
- **Automatic Case Creation** - High-risk transactions automatically generate cases
- **Manual Case Creation** - Compliance officers can create cases for any transaction
- **Case Numbering** - Unique case numbers for tracking and reference
- **Priority Assignment** - Urgent, high, medium, low priority levels
- **Team Assignment** - Assign cases to specific investigators

#### 2. Case Workflow
- **Status Progression** - Open → In Progress → Resolved → Closed
- **Investigation Notes** - Detailed notes throughout the investigation process
- **Document Attachments** - Attach supporting documents and evidence
- **Time Tracking** - Track time spent on each case for billing/reporting
- **Review Process** - Senior review before case closure

#### 3. Case Data Model
```typescript
interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  transactionIds?: string[];
  notes?: any[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### 4. Case Analytics
- **Resolution Time Tracking** - Average time to resolve cases by priority
- **Assignment Distribution** - Case load distribution across team members
- **Case Volume Trends** - Historical case creation patterns
- **Success Metrics** - Resolution rates and quality scores

---

## Sanctions Screening

### Multi-source Sanctions Management

#### 1. Sanctions List Sources
- **OFAC (Office of Foreign Assets Control)** - US Treasury sanctions
- **UN Security Council** - United Nations sanctions lists
- **EU Consolidated List** - European Union sanctions
- **Manual Entries** - Custom sanctions list maintained by institution

#### 2. Wallet Address Management
- **Address Addition** - Add new wallet addresses to sanctions list
- **Source Tracking** - Track which list each address comes from
- **Reason Documentation** - Document why addresses are sanctioned
- **Active/Inactive Status** - Enable/disable sanctions entries
- **Bulk Import** - Import large sanctions lists via CSV/API

#### 3. Real-time Screening
- **Transaction Screening** - All transactions screened against sanctions lists
- **Address Validation** - Ethereum address format validation
- **Match Detection** - Exact and fuzzy matching algorithms
- **Alert Generation** - Automatic alerts for sanctions matches
- **Whitelist Management** - Maintain approved address whitelist

#### 4. PEP (Politically Exposed Person) Monitoring
- **Global PEP Database** - Integration with international PEP databases
- **Relationship Mapping** - Track relationships to PEPs (family, associates)
- **Risk Scoring** - Enhanced risk scores for PEP-related transactions
- **Monitoring Alerts** - Special alerts for PEP transaction patterns

### Sanctions Data Model
```typescript
interface SanctionedWallet {
  id: string;
  address: string;
  reason?: string;
  addedBy?: string;
  source: 'manual' | 'ofac' | 'un' | 'eu';
  isActive: boolean;
  createdAt: Date;
}
```

---

## API Key Management

### Full Lifecycle API Management

#### 1. API Key Creation
- **Key Generation** - Secure API key generation with cryptographic hashing
- **Environment Selection** - Development and production environments
- **Usage Permissions** - Granular permissions for different API endpoints
- **Rate Limiting** - Configurable rate limits per API key
- **IP Restrictions** - Whitelist specific IP addresses for key usage

#### 2. Key Management Features
- **Key Rotation** - Generate new keys and deprecate old ones
- **Active/Inactive Status** - Enable/disable keys without deletion
- **Usage Analytics** - Track API calls, response times, error rates
- **Key Preview** - Secure display of key prefixes for identification
- **Copy to Clipboard** - Easy key copying with security considerations

#### 3. API Endpoints Available
- **POST /v1/check** - Risk assessment without transaction broadcasting
- **POST /v1/relay** - Transaction relay with risk assessment
- **POST /v1/wallet-risk** - Comprehensive wallet risk analysis
- **POST /v1/sanctions/manage** - Sanctions list management

#### 4. Usage Monitoring
- **Request Counting** - Track total requests per key
- **Last Used Tracking** - Monitor key activity patterns
- **Error Rate Monitoring** - Track failed requests and error types
- **Performance Metrics** - Response time and throughput analytics

### API Key Data Model
```typescript
interface ApiKey {
  id: string;
  userId: string;
  name: string;
  keyHash: string;
  keyPreview: string;
  environment: 'production' | 'development';
  isActive: boolean;
  lastUsed?: Date;
  usageCount: number;
  createdAt: Date;
}
```

---

## Settings & Configuration

### Comprehensive Configuration Management

#### 1. Notification Settings
- **Email Alerts** - Configure email notifications for different alert types
- **SMS Alerts** - Critical alerts via SMS with phone number verification
- **Push Notifications** - Browser push notifications for real-time alerts
- **Alert Thresholds** - Customize which alert levels trigger notifications
- **Notification Scheduling** - Quiet hours and weekend notification preferences

#### 2. Security Settings
- **Two-Factor Authentication** - Enable/disable 2FA with QR code setup
- **IP Whitelisting** - Restrict API access to specific IP addresses
- **Session Management** - Configure session timeout and concurrent sessions
- **Password Policy** - Set password complexity requirements
- **Login Monitoring** - Track and alert on suspicious login attempts

#### 3. API Configuration
- **Rate Limiting** - Set requests per hour limits for different endpoints
- **Webhook Configuration** - Configure webhooks for real-time event notifications
- **Retry Logic** - Configure retry attempts for failed API calls
- **Timeout Settings** - Set request timeout values
- **API Versioning** - Manage different API versions and deprecation

#### 4. Compliance Settings
- **Auto-reporting** - Enable automatic regulatory report generation
- **PEP Monitoring** - Configure PEP screening sensitivity levels
- **Sanctions Updates** - Automatic sanctions list synchronization frequency
- **Risk Thresholds** - Set risk score thresholds for automatic flagging
- **Retention Policies** - Data retention periods for compliance records

#### 5. Interface Settings
- **Theme Selection** - Light, dark, or system theme preferences
- **Timezone Configuration** - Set timezone for all date/time displays
- **Language Selection** - Multi-language support configuration
- **Date Format** - Customize date display formats
- **Dashboard Layout** - Customize dashboard component arrangement

---

## Advanced Filtering & Search

### Multi-criteria Filtering System

#### 1. Transaction Filtering
- **Date Range Selection** - Last 7/30/90 days or custom date ranges
- **Risk Level Filtering** - Critical (90+), High (70-89), Medium (40-69), Low (0-39)
- **Country Filtering** - Source and destination country selection
- **Transaction Type Filtering** - Wire transfers, cash deposits, international, cryptocurrency
- **Amount Range** - Filter by transaction amount ranges
- **Customer Filtering** - Filter by specific customers or customer types

#### 2. Real-time Filter Results
- **Dynamic Updates** - Results update immediately as filters change
- **Result Counting** - Display number of matching transactions
- **Sorting Options** - Sort by date, amount, risk score, status
- **Pagination** - Efficient pagination for large result sets
- **Export Filtered Data** - Export filtered results to CSV/PDF

#### 3. Saved Searches
- **Filter Presets** - Save commonly used filter combinations
- **Shared Filters** - Share filter presets with team members
- **Quick Filters** - One-click access to frequently used filters
- **Search History** - Track and repeat previous searches

#### 4. Advanced Search Features
- **Boolean Search** - AND, OR, NOT operators for complex queries
- **Wildcard Search** - Pattern matching with * and ? wildcards
- **Regular Expressions** - Advanced pattern matching capabilities
- **Full-text Search** - Search across all transaction fields simultaneously

---

## Risk Assessment Engine

### Multi-factor Risk Calculation

#### 1. Risk Scoring Factors
- **Transaction Amount** - Risk increases with transaction size
- **Velocity Analysis** - Frequency and timing of transactions
- **Geographic Risk** - Source and destination country risk ratings
- **Customer History** - Historical transaction patterns and risk profile
- **Network Analysis** - Connections to other high-risk entities
- **Time-based Patterns** - Unusual timing patterns (nights, weekends, holidays)

#### 2. Risk Calculation Methods
- **Weighted Scoring** - Different factors have different importance weights
- **Machine Learning Models** - AI-based risk prediction algorithms
- **Rule-based Engine** - Configurable business rules for risk assessment
- **Threshold Monitoring** - Automatic flagging based on risk thresholds
- **Dynamic Scoring** - Risk scores update as new information becomes available

#### 3. Risk Profile Management
```typescript
interface RiskProfile {
  id: string;
  customerId: string;
  customerName: string;
  overallRiskScore: number;
  riskFactors: any[];
  pepStatus: boolean;
  sanctionsMatch: boolean;
  lastAssessment: Date;
}
```

#### 4. Pattern Detection
- **Structuring Detection** - Identify transactions designed to avoid reporting thresholds
- **Round Amount Patterns** - Detect suspicious round number transactions
- **Rapid Fire Transactions** - Multiple quick transactions from same source
- **Geographic Anomalies** - Transactions from unexpected locations
- **Behavioral Changes** - Deviations from established customer patterns

---

## Compliance Reporting

### Automated Regulatory Reporting

#### 1. Report Types
- **SAR (Suspicious Activity Reports)** - Regulatory filing for suspicious activities
- **CTR (Currency Transaction Reports)** - Reports for large currency transactions
- **Monthly Compliance Reports** - Internal monthly compliance summaries
- **Quarterly Risk Reports** - Quarterly risk assessment reports
- **Annual Compliance Audits** - Comprehensive annual compliance reviews

#### 2. Report Generation Features
- **Automated Scheduling** - Generate reports on configurable schedules
- **Template Management** - Customizable report templates for different requirements
- **Data Aggregation** - Automatic data collection and aggregation from multiple sources
- **Export Formats** - PDF, Excel, CSV, XML export options
- **Digital Signatures** - Cryptographic signing for report authenticity

#### 3. Report Data Model
```typescript
interface ComplianceReport {
  id: string;
  title: string;
  reportType: 'sar' | 'ctr' | 'monthly' | 'quarterly';
  description?: string;
  fileUrl?: string;
  generatedBy?: string;
  createdAt: Date;
}
```

#### 4. Audit Trail
- **Report History** - Track all generated reports with timestamps
- **Access Logging** - Log who accessed which reports when
- **Change Tracking** - Track modifications to report templates and settings
- **Export Tracking** - Log all report exports and downloads
- **Regulatory Submission** - Track submission status to regulatory bodies

---

## Database Schema

### Complete Database Structure

#### 1. Core Tables

**Users Table**
- Primary authentication and profile data
- Support for business information and verification status
- Two-factor authentication and security settings
- Login tracking and activity monitoring

**Transactions Table**
- Complete transaction records with risk scoring
- Multi-currency support with precision decimal handling
- Status tracking through transaction lifecycle
- Geographic data for compliance requirements

**Alerts Table**
- Multi-severity alert system with categorization
- Assignment and resolution tracking
- Links to related transactions and cases
- Timestamp tracking for SLA management

**Cases Table**
- Investigation case management with unique case numbers
- Priority and status workflow management
- Support for multiple related transactions
- Notes and documentation storage as JSONB

#### 2. Compliance Tables

**API Keys Table**
- Secure API key management with hashing
- Environment separation (production/development)
- Usage tracking and rate limiting support
- Activity monitoring and security features

**Sanctioned Wallets Table**
- Multi-source sanctions list management
- Support for OFAC, UN, EU, and manual entries
- Reason tracking and audit trail
- Active/inactive status management

**Compliance Reports Table**
- Report metadata and file storage
- Multiple report type support
- User attribution and timestamp tracking
- Integration with document management systems

#### 3. Risk Management Tables

**Risk Profiles Table**
- Customer-specific risk assessments
- PEP and sanctions status tracking
- Risk factor storage as JSONB
- Historical risk assessment tracking

**Wallet Risk Scores Table**
- Blockchain wallet risk assessment
- Risk band classification (LOW, MEDIUM, HIGH, CRITICAL, PROHIBITED)
- Confidence scoring for risk assessments
- Integration with external risk data sources

---

## Backend API Endpoints

### Complete API Specification

#### 1. Core Data Endpoints
```
GET    /api/metrics                     - Dashboard metrics
GET    /api/transactions/recent         - Recent transactions feed
GET    /api/transactions/filtered       - Advanced filtering
POST   /api/transactions               - Create new transaction
GET    /api/alerts/critical            - Critical alerts
POST   /api/alerts                     - Create alert
GET    /api/cases                      - Case management
POST   /api/cases                      - Create case
```

#### 2. API Management Endpoints
```
GET    /api/api-keys                   - List API keys
POST   /api/api-keys                   - Create API key
PATCH  /api/api-keys/:id               - Update API key
DELETE /api/api-keys/:id               - Delete API key
```

#### 3. Sanctions Management Endpoints
```
GET    /api/sanctioned-wallets         - List sanctioned wallets
POST   /api/sanctioned-wallets         - Add sanctioned wallet
DELETE /api/sanctioned-wallets/:id     - Remove sanctioned wallet
GET    /api/pep-profiles               - PEP profiles
```

#### 4. Compliance Endpoints
```
GET    /api/compliance-reports         - List compliance reports
POST   /api/compliance-reports         - Generate report
GET    /api/risk-profiles              - Customer risk profiles
POST   /api/wallet-risk                - Wallet risk assessment
```

#### 5. External API Endpoints (for partners)
```
POST   /v1/check                       - Risk assessment without broadcasting
POST   /v1/relay                       - Transaction relay with risk assessment
POST   /v1/wallet-risk                 - Comprehensive wallet analysis
POST   /v1/sanctions/manage            - Sanctions list management
```

---

## Real-time Features

### Live Data & Notifications

#### 1. Real-time Transaction Feed
- **WebSocket Connection** - Persistent connection for live updates
- **Transaction Streaming** - New transactions appear immediately
- **Risk Score Updates** - Real-time risk score calculations
- **Status Changes** - Live status updates for existing transactions
- **Auto-refresh Intervals** - Configurable refresh rates

#### 2. Live Alert System
- **Instant Notifications** - Alerts appear immediately when generated
- **Browser Notifications** - System-level notifications for critical alerts
- **Sound Alerts** - Audio notifications for urgent alerts
- **Visual Indicators** - Flashing or color changes for new alerts
- **Alert Counters** - Real-time count of unread alerts

#### 3. Dashboard Updates
- **Metric Refreshing** - Key metrics update automatically
- **Chart Data Updates** - Analytics charts refresh with new data
- **Status Indicators** - System status and health indicators
- **User Activity Tracking** - Real-time user presence and activity

---

## External Integrations

### Third-party Services & APIs

#### 1. Blockchain Data Sources
- **Etherscan API** - Ethereum transaction data and wallet analysis
- **Bitquery GraphQL** - Cross-chain blockchain data aggregation
- **Chain Analysis** - Professional blockchain analytics platform
- **Elliptic** - Cryptocurrency compliance and investigation tools

#### 2. Sanctions & PEP Data
- **OFAC API** - US Treasury sanctions list updates
- **World-Check** - Thomson Reuters sanctions and PEP database
- **Dow Jones Risk Center** - Global watchlist and PEP database
- **LexisNexis** - Due diligence and compliance data

#### 3. Risk Assessment Services
- **Chainalysis** - Blockchain transaction monitoring and risk scoring
- **Coinfirm** - AML platform with risk assessment APIs
- **Scorechain** - Cryptocurrency compliance and monitoring
- **Crystal Blockchain** - Investigation and compliance platform

#### 4. Communication & Notifications
- **Twilio API** - SMS notifications for critical alerts
- **SendGrid API** - Email notification delivery
- **Slack Webhooks** - Team notifications and alerts
- **Microsoft Teams** - Enterprise notification integration

#### 5. Document & Storage
- **AWS S3** - Document and report storage
- **Google Cloud Storage** - Scalable file storage
- **Azure Blob Storage** - Enterprise document management
- **IPFS** - Decentralized storage for audit trails

---

## Technical Architecture Summary

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Tailwind CSS** with shadcn/ui components
- **TanStack React Query** for server state management
- **Wouter** for lightweight routing
- **Recharts** for data visualization
- **Real-time WebSocket** connections

### Backend Architecture
- **Node.js** with Express.js framework
- **TypeScript** for type safety
- **PostgreSQL** with Drizzle ORM
- **Session-based authentication** with PostgreSQL session store
- **RESTful API** design with comprehensive validation

### Database & Storage
- **PostgreSQL** primary database with JSONB support
- **Drizzle ORM** for type-safe database operations
- **Connection pooling** for scalability
- **Automated migrations** with version control
- **Comprehensive indexing** for performance

### Security & Compliance
- **Bcrypt password hashing** with salt rounds
- **Session security** with secure cookies
- **API rate limiting** and throttling
- **Input validation** with Zod schemas
- **SQL injection prevention** with parameterized queries
- **HTTPS enforcement** and security headers

---

This comprehensive documentation covers all features and backend requirements of the AML Developer Dashboard. The application provides enterprise-grade compliance monitoring with real-time capabilities, extensive configurability, and robust security measures suitable for financial institutions and fintechs requiring AML compliance solutions.