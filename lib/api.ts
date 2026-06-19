const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

export interface AuthResponse {
  userId: string;
  email: string;
  token: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  organizationId?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  location: string;
  familySize: number;
  status: "registered" | "verified";
  createdAt: string;
}

export interface EmergencyFund {
  id: string;
  name: string;
  description: string;
  amount: string;
  disasterType: string;
  location: string;
  status: "deployed" | "active" | "completed";
  createdAt: string;
}

export interface ConditionalTransfer {
  id: string;
  beneficiaryId: string;
  amount: string;
  status: "active" | "spent" | "expired";
  expiresAt: string;
}

export interface Merchant {
  id: string;
  name: string;
  category: string;
  location: string;
  status: "verified" | "pending_verification";
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || {
            message: "Request failed",
            code: "REQUEST_FAILED",
          },
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Network error",
          code: "NETWORK_ERROR",
        },
      };
    }
  }

  // Authentication
  async signup(
    email: string,
    password: string,
    organizationName: string,
    organizationType: string
  ): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        organizationName,
        organizationType,
      }),
    });
  }

  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe(): Promise<ApiResponse<User>> {
    return this.request<User>("/auth/me");
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>("/auth/logout", { method: "POST" });
  }

  // Beneficiaries
  async getBeneficiaries(): Promise<ApiResponse<Beneficiary[]>> {
    return this.request<Beneficiary[]>("/beneficiaries");
  }

  async getBeneficiary(id: string): Promise<ApiResponse<Beneficiary>> {
    return this.request<Beneficiary>(`/beneficiaries/${id}`);
  }

  async registerBeneficiary(
    data: Partial<Beneficiary>
  ): Promise<ApiResponse<Beneficiary>> {
    return this.request<Beneficiary>("/beneficiaries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async verifyBeneficiary(id: string): Promise<ApiResponse<Beneficiary>> {
    return this.request<Beneficiary>(`/beneficiaries/${id}/verify`, {
      method: "POST",
    });
  }

  async generateQRCode(id: string): Promise<ApiResponse<{ qrCode: string }>> {
    return this.request<{ qrCode: string }>(`/beneficiaries/${id}/qr-code`, {
      method: "POST",
    });
  }

  // Emergency Funds
  async getFunds(): Promise<ApiResponse<EmergencyFund[]>> {
    return this.request<EmergencyFund[]>("/funds");
  }

  async getFund(id: string): Promise<ApiResponse<EmergencyFund>> {
    return this.request<EmergencyFund>(`/funds/${id}`);
  }

  async deployFund(
    data: Partial<EmergencyFund>
  ): Promise<ApiResponse<EmergencyFund>> {
    return this.request<EmergencyFund>("/funds", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async triggerDisbursement(
    fundId: string,
    amount: string,
    recipientId: string,
    purpose: string
  ): Promise<ApiResponse<{ disbursementId: string }>> {
    return this.request<{ disbursementId: string }>(`/funds/${fundId}/disburse`, {
      method: "POST",
      body: JSON.stringify({ amount, recipientId, purpose }),
    });
  }

  async getFundStats(id: string): Promise<
    ApiResponse<{
      totalDeployed: string;
      totalDisbursed: string;
      beneficiariesServed: number;
    }>
  > {
    return this.request(`/funds/${id}/stats`);
  }

  // Merchants
  async getMerchants(): Promise<ApiResponse<Merchant[]>> {
    return this.request<Merchant[]>("/merchants");
  }

  async getMerchant(id: string): Promise<ApiResponse<Merchant>> {
    return this.request<Merchant>(`/merchants/${id}`);
  }

  async registerMerchant(data: Partial<Merchant>): Promise<ApiResponse<Merchant>> {
    return this.request<Merchant>("/merchants", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async verifyMerchant(id: string): Promise<ApiResponse<Merchant>> {
    return this.request<Merchant>(`/merchants/${id}/verify`, {
      method: "POST",
    });
  }

  // Transfers
  async getTransfers(): Promise<ApiResponse<ConditionalTransfer[]>> {
    return this.request<ConditionalTransfer[]>("/transfers");
  }

  async getTransfer(id: string): Promise<ApiResponse<ConditionalTransfer>> {
    return this.request<ConditionalTransfer>(`/transfers/${id}`);
  }

  async createTransfer(
    data: Partial<ConditionalTransfer>
  ): Promise<ApiResponse<ConditionalTransfer>> {
    return this.request<ConditionalTransfer>("/transfers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Supply Chain
  async getShipments(): Promise<ApiResponse<any[]>> {
    return this.request("/supply-chain");
  }

  async getShipment(id: string): Promise<ApiResponse<any>> {
    return this.request(`/supply-chain/${id}`);
  }

  async createShipment(data: any): Promise<ApiResponse<any>> {
    return this.request("/supply-chain", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCheckpoint(
    shipmentId: string,
    data: any
  ): Promise<ApiResponse<any>> {
    return this.request(`/supply-chain/${shipmentId}/checkpoint`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
