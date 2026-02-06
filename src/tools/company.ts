// Aircall Company & Integrations Tools
// Company info and integration management

import { z } from 'zod';
import type { AircallClient } from '../utils/auth.js';
import type {
  CompanyResponse,
  IntegrationsListResponse,
} from '../types/aircall.js';

// Schema definitions
export const enableIntegrationSchema = z.object({
  integration_id: z.number().describe('The integration ID to enable'),
});

export const disableIntegrationSchema = z.object({
  integration_id: z.number().describe('The integration ID to disable'),
});

// Tool implementations
export function createCompanyTools(client: AircallClient) {
  return {
    aircall_get_company: {
      description: 'Get information about the Aircall company account including user and number counts.',
      parameters: z.object({}),
      execute: async () => {
        const result = await client.get<CompanyResponse>('/company');
        return {
          name: result.company.name,
          users_count: result.company.users_count,
          numbers_count: result.company.numbers_count,
          created_at: new Date(result.company.created_at * 1000).toISOString(),
        };
      },
    },

    aircall_list_integrations: {
      description: 'List all available integrations and their enabled status.',
      parameters: z.object({}),
      execute: async () => {
        const result = await client.get<IntegrationsListResponse>('/integrations');
        return {
          integrations: result.integrations.map((int) => ({
            id: int.id,
            name: int.name,
            logo_url: int.logo_url,
            enabled: int.enabled,
            connected_at: int.connected_at
              ? new Date(int.connected_at * 1000).toISOString()
              : null,
          })),
          summary: {
            total: result.integrations.length,
            enabled: result.integrations.filter((i) => i.enabled).length,
            disabled: result.integrations.filter((i) => !i.enabled).length,
          },
        };
      },
    },

    aircall_enable_integration: {
      description: 'Enable an integration. Some integrations may require additional configuration.',
      parameters: enableIntegrationSchema,
      execute: async (params: z.infer<typeof enableIntegrationSchema>) => {
        await client.post(`/integrations/${params.integration_id}/enable`);
        return {
          success: true,
          message: 'Integration enabled successfully',
          integration_id: params.integration_id,
        };
      },
    },

    aircall_disable_integration: {
      description: 'Disable an integration.',
      parameters: disableIntegrationSchema,
      execute: async (params: z.infer<typeof disableIntegrationSchema>) => {
        await client.post(`/integrations/${params.integration_id}/disable`);
        return {
          success: true,
          message: 'Integration disabled successfully',
          integration_id: params.integration_id,
        };
      },
    },
  };
}
