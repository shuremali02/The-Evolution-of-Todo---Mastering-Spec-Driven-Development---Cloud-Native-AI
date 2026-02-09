/**
 * Service for interacting with the audit API
 */

interface AuditEvent {
  event_id: string;
  event_type: 'created' | 'updated' | 'completed' | 'deleted';
  task_id: number;
  event_data: {
    title: string;
    description: string;
    completed: boolean;
  };
  timestamp: string;
}

interface AuditResponse {
  user_id: string;
  events: AuditEvent[];
}

export interface AuditServiceConfig {
  baseUrl: string;
}

export class AuditService {
  private config: AuditServiceConfig;

  constructor(config?: Partial<AuditServiceConfig>) {
    this.config = {
      baseUrl: config?.baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
    };
  }

  /**
   * Fetch audit trail for a specific user
   */
  async getAuditTrail(userId: string): Promise<AuditResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/${userId}/audit`);

      if (!response.ok) {
        throw new Error(`Failed to fetch audit trail: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching audit trail:', error);
      throw error;
    }
  }

  /**
   * Fetch audit trail for a specific user with filters
   */
  async getFilteredAuditTrail(userId: string, eventType?: string): Promise<AuditEvent[]> {
    try {
      let url = `${this.config.baseUrl}/api/${userId}/audit`;
      if (eventType) {
        url += `?event_type=${eventType}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch filtered audit trail: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error fetching filtered audit trail:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const auditService = new AuditService();

export default auditService;