import { Layout } from "@/components/layout/Layout";
import { ApiKeyManager } from '@/components/ApiKeyManager';

export default function ApiManagementPage() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">API Management</h1>
        <ApiKeyManager />
      </div>
    </Layout>
  );
}