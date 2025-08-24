const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface OpenAPISpec {
  id: number;
  title: string;
  version: string;
  description?: string;
  created_at: string;
}

export interface TutorialGuide {
  id: number;
  spec_id: number;
  title: string;
  description: string;
  status: "processing" | "ready" | "error";
  created_at: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // API methods
  async getHealth() {
    return this.get<{ status: string; service: string; version: string }>(
      "/health"
    );
  }

  async getSpecs() {
    return this.get<{ specs: OpenAPISpec[]; count: number }>("/specs");
  }

  async getGuides() {
    return this.get<{ guides: TutorialGuide[]; count: number }>("/guides");
  }

  async ingestSpec(specContent: string, sourceUrl?: string) {
    return this.post<{ guide_id: string; message: string }>("/ingest", {
      spec_content: specContent,
      source_url: sourceUrl,
    });
  }
}

export const apiClient = new ApiClient();
