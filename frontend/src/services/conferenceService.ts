import axios from 'axios';
import { getCookie } from '@/lib/cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ConferenceCreate {
  title: string;
  description?: string;
  type?: ConferenceType;
  max_participants?: number;
  language_from?: string;
  language_to?: string;
  scheduled_at?: string;
}

export enum ConferenceStatus {
  PENDING = "PENDING",
  STARTED = "STARTED",
  PAUSED = "PAUSED",
  ENDED = "ENDED",
  CANCELLED = "CANCELLED"
}

export enum ConferenceType {
  INSTANT = "INSTANT",
  SCHEDULED = "SCHEDULED"
}

export interface Conference {
  id: string;
  title: string;
  description?: string;
  conference_code: string;
  max_participants: number;
  language_from: string;
  language_to: string;
  is_active: boolean;
  status: ConferenceStatus;
  type: ConferenceType;
  scheduled_at?: string;
  started_at?: string;
  ended_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface ConferenceWithParticipants extends Conference {
  participant_count: number;
}

export interface ConferenceStats {
  total_conferences: number;
  active_conferences: number;
  total_participants: number;
}

class ConferenceService {
  private getAuthHeaders() {
    const token = getCookie('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async createConference(data: ConferenceCreate): Promise<Conference> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/conferences/`,
        data,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating conference:', error);
      throw error;
    }
  }

  // guest creation removed; only authenticated hosts can create conferences

  // Conference Status Management
  async startConference(id: string): Promise<Conference> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/conferences/${id}/start`,
        {},
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error starting conference:', error);
      throw error;
    }
  }

  async pauseConference(id: string): Promise<Conference> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/conferences/${id}/pause`,
        {},
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error pausing conference:', error);
      throw error;
    }
  }

  async resumeConference(id: string): Promise<Conference> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/conferences/${id}/resume`,
        {},
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error resuming conference:', error);
      throw error;
    }
  }

  async endConference(id: string): Promise<Conference> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/conferences/${id}/end`,
        {},
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error ending conference:', error);
      throw error;
    }
  }

  async getMyConferences(skip = 0, limit = 100): Promise<ConferenceWithParticipants[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/conferences/?skip=${skip}&limit=${limit}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching conferences:', error);
      throw error;
    }
  }

  async getConferenceStats(): Promise<ConferenceStats> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/conferences/stats`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching conference stats:', error);
      throw error;
    }
  }

  async getConferenceById(id: string): Promise<Conference> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/conferences/${id}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching conference:', error);
      throw error;
    }
  }

  async getConferenceByCode(code: string): Promise<Conference> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/conferences/code/${code}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching conference by code:', error);
      throw error;
    }
  }

  async updateConference(id: string, data: Partial<ConferenceCreate>): Promise<Conference> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/conferences/${id}`,
        data,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating conference:', error);
      throw error;
    }
  }

  async deleteConference(id: string): Promise<void> {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/v1/conferences/${id}`,
        { headers: this.getAuthHeaders() }
      );
    } catch (error) {
      console.error('Error deleting conference:', error);
      throw error;
    }
  }

  async toggleConferenceStatus(id: string): Promise<Conference> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/conferences/${id}/toggle-status`,
        {},
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error toggling conference status:', error);
      throw error;
    }
  }
}

export const conferenceService = new ConferenceService();
