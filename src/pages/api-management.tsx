// @ts-nocheck
import { Layout } from "@/components/layout/Layout";
import { ApiKeyManagement } from '@/components/ApiKeyManagement';

export default function ApiManagementPage() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">API Management</h1>
        <ApiKeyManagement />
      </div>
    </Layout>
  );
}