// Aircall Dialer Campaign Tools
// Power dialer campaign management

import { z } from 'zod';
import type { AircallClient } from '../utils/auth.js';
import type {
  CampaignsListResponse,
  CampaignResponse,
  DialerCampaign,
  CampaignNumbersResponse,
} from '../types/aircall.js';

// Schema definitions
export const listCampaignsSchema = z.object({
  page: z.number().optional().describe('Page number (default: 1)'),
  per_page: z.number().optional().describe('Results per page (default: 20, max: 50)'),
  status: z
    .enum(['active', 'paused', 'completed'])
    .optional()
    .describe('Filter by campaign status'),
});

export const getCampaignSchema = z.object({
  campaign_id: z.number().describe('The campaign ID'),
});

export const createCampaignSchema = z.object({
  name: z.string().describe('Campaign name'),
  user_ids: z.array(z.number()).optional().describe('User IDs to assign to the campaign'),
});

export const deleteCampaignSchema = z.object({
  campaign_id: z.number().describe('The campaign ID to delete'),
});

export const getCampaignNumbersSchema = z.object({
  campaign_id: z.number().describe('The campaign ID'),
  page: z.number().optional().describe('Page number'),
  per_page: z.number().optional().describe('Results per page'),
  status: z
    .enum(['pending', 'dialed', 'completed', 'skipped'])
    .optional()
    .describe('Filter by number status'),
});

export const addCampaignNumbersSchema = z.object({
  campaign_id: z.number().describe('The campaign ID'),
  phone_numbers: z
    .array(
      z.object({
        phone_number: z.string().describe('Phone number to add'),
        contact_id: z.number().optional().describe('Associated contact ID'),
        notes: z.string().optional().describe('Notes for this number'),
      })
    )
    .describe('Phone numbers to add to the campaign'),
});

export const removeCampaignNumberSchema = z.object({
  campaign_id: z.number().describe('The campaign ID'),
  phone_number_id: z.number().describe('The phone number ID to remove'),
});

// Helper to format campaign for output
function formatCampaign(campaign: DialerCampaign) {
  return {
    id: campaign.id,
    direct_link: campaign.direct_link,
    name: campaign.name,
    status: campaign.status,
    created_at: new Date(campaign.created_at * 1000).toISOString(),
    updated_at: new Date(campaign.updated_at * 1000).toISOString(),
    numbers_count: campaign.numbers_count,
    dialed_count: campaign.dialed_count,
    progress_percent:
      campaign.numbers_count > 0
        ? Math.round((campaign.dialed_count / campaign.numbers_count) * 100)
        : 0,
    users: campaign.users.map((u) => ({
      id: u.id,
      name: u.name,
      available: u.available,
    })),
  };
}

// Tool implementations
export function createDialerTools(client: AircallClient) {
  return {
    aircall_list_campaigns: {
      description: 'List power dialer campaigns with their progress and assigned users.',
      parameters: listCampaignsSchema,
      execute: async (params: z.infer<typeof listCampaignsSchema>) => {
        const result = await client.get<CampaignsListResponse>('/dialer_campaigns', params);
        return {
          total: result.meta.total,
          page: result.meta.current_page,
          per_page: result.meta.per_page,
          campaigns: result.campaigns.map(formatCampaign),
        };
      },
    },

    aircall_get_campaign: {
      description: 'Get detailed information about a specific power dialer campaign.',
      parameters: getCampaignSchema,
      execute: async (params: z.infer<typeof getCampaignSchema>) => {
        const result = await client.get<CampaignResponse>(
          `/dialer_campaigns/${params.campaign_id}`
        );
        return formatCampaign(result.campaign);
      },
    },

    aircall_create_campaign: {
      description: 'Create a new power dialer campaign for outbound calling.',
      parameters: createCampaignSchema,
      execute: async (params: z.infer<typeof createCampaignSchema>) => {
        const result = await client.post<CampaignResponse>('/dialer_campaigns', {
          name: params.name,
          user_ids: params.user_ids,
        });
        return {
          success: true,
          message: 'Campaign created successfully',
          campaign: formatCampaign(result.campaign),
        };
      },
    },

    aircall_delete_campaign: {
      description: 'Delete a power dialer campaign.',
      parameters: deleteCampaignSchema,
      execute: async (params: z.infer<typeof deleteCampaignSchema>) => {
        await client.delete(`/dialer_campaigns/${params.campaign_id}`);
        return {
          success: true,
          message: 'Campaign deleted successfully',
          campaign_id: params.campaign_id,
        };
      },
    },

    aircall_get_campaign_numbers: {
      description: 'Get phone numbers in a power dialer campaign with their dial status.',
      parameters: getCampaignNumbersSchema,
      execute: async (params: z.infer<typeof getCampaignNumbersSchema>) => {
        const { campaign_id, ...queryParams } = params;
        const result = await client.get<CampaignNumbersResponse>(
          `/dialer_campaigns/${campaign_id}/phone_numbers`,
          queryParams
        );
        return {
          total: result.meta.total,
          page: result.meta.current_page,
          per_page: result.meta.per_page,
          phone_numbers: result.phone_numbers.map((pn) => ({
            id: pn.id,
            phone_number: pn.phone_number,
            status: pn.status,
            notes: pn.notes,
            contact: pn.contact
              ? {
                  id: pn.contact.id,
                  name: `${pn.contact.first_name || ''} ${pn.contact.last_name || ''}`.trim(),
                }
              : null,
          })),
        };
      },
    },

    aircall_add_campaign_numbers: {
      description: 'Add phone numbers to a power dialer campaign for agents to call.',
      parameters: addCampaignNumbersSchema,
      execute: async (params: z.infer<typeof addCampaignNumbersSchema>) => {
        await client.post(`/dialer_campaigns/${params.campaign_id}/phone_numbers`, {
          phone_numbers: params.phone_numbers,
        });
        return {
          success: true,
          message: `Added ${params.phone_numbers.length} numbers to campaign`,
          campaign_id: params.campaign_id,
          numbers_added: params.phone_numbers.length,
        };
      },
    },

    aircall_remove_campaign_number: {
      description: 'Remove a phone number from a power dialer campaign.',
      parameters: removeCampaignNumberSchema,
      execute: async (params: z.infer<typeof removeCampaignNumberSchema>) => {
        await client.delete(
          `/dialer_campaigns/${params.campaign_id}/phone_numbers/${params.phone_number_id}`
        );
        return {
          success: true,
          message: 'Phone number removed from campaign',
          campaign_id: params.campaign_id,
          phone_number_id: params.phone_number_id,
        };
      },
    },
  };
}
