# AML (Anti-Money Laundering) Developer Dashboard

## Overview

This is a comprehensive AML compliance dashboard application built for fintechs, payment platforms, and financial institutions to monitor suspicious activities and manage compliance operations. The application provides real-time transaction monitoring, risk assessment, sanctions screening, case management, and regulatory reporting capabilities. It features a modern React frontend with an Express.js backend, using PostgreSQL for data persistence and Drizzle ORM for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Charts & Visualization**: Recharts for analytics charts and data visualization
- **Theme System**: Custom theme provider supporting dark/light modes with CSS variables

### Backend Architecture
- **Runtime**: Node.js with TypeScript and ES modules
- **Framework**: Express.js for RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Shared TypeScript schema definitions between frontend and backend
- **Development**: Vite for fast development builds and hot module replacement

### Data Storage Solutions
- **Primary Database**: PostgreSQL for transactional data, user management, and compliance records
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database queries
- **Connection**: Neon Database serverless PostgreSQL for cloud hosting
- **Migrations**: Drizzle Kit for database schema migrations and versioning

### Key Data Models
- **Transactions**: Customer transactions with risk scoring and flagging
- **Alerts**: System-generated alerts for suspicious activities  
- **Cases**: Investigation cases with status tracking and notes
- **Users**: System users with authentication and profile management
- **API Keys**: Partner API key management with usage tracking
- **Compliance Reports**: Exportable regulatory reports and audit trails

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store
- **API Security**: Bearer token authentication for API endpoints
- **User Management**: Role-based access control for different user types

### Real-time Features
- **Live Transaction Feed**: Real-time monitoring of transaction streams
- **Alert Notifications**: Instant alerts for high-risk activities
- **Dashboard Updates**: Auto-refreshing metrics and status indicators

### Risk Assessment Engine
- **Risk Scoring**: Multi-factor risk calculation based on transaction patterns
- **Sanctions Screening**: Integration with sanctions lists (OFAC, UN, EU)
- **PEP Monitoring**: Politically Exposed Person screening capabilities
- **Pattern Detection**: Automated detection of suspicious transaction patterns

### Inline Section Management
- **API Management**: Create, rotate, and manage API keys with usage metrics
- **Settings**: Account preferences, notifications, and security settings
- **Billing**: Subscription management, invoices, and payment methods
- **Profile**: User profile management and activity logging

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI component primitives
- **recharts**: Chart library for data visualization
- **express**: Web framework for API server
- **web3**: Ethereum blockchain interaction utilities

### UI and Styling
- **tailwindcss**: Utility-first CSS framework
- **shadcn/ui**: Pre-built accessible React components
- **lucide-react**: Icon library for consistent iconography
- **class-variance-authority**: Utility for component variant management

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **drizzle-kit**: Database migration and schema management
- **tsx**: TypeScript execution for development

### Third-party Integrations
- **Etherscan API**: Ethereum transaction data and analysis
- **Bitquery GraphQL**: Cross-chain blockchain data
- **Various Risk APIs**: External risk assessment services for enhanced compliance checking

The application follows a monorepo structure with shared TypeScript schemas, enabling type safety across the full stack and ensuring consistency between frontend and backend data models.