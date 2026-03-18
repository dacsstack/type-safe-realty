export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface AuthResponse {
  token: string;
  message: string;
  role: string;
}

export interface Property {
  ProjectId: number;
  ProjectName: string;
  Developer: string;
  PropertyDetails: string;
  DateOfJoining: string;
  PhotoFileName: string[];
  Location: string;
  Price: number;
  PropertyType: string;
  Latitude: number;
  Longitude: number;
}

export interface PropertyFilters {
  location?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}
