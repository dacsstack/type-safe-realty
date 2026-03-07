// Blog Interface
export interface Blog {
  BlogId: number;
  Title: string;
  Description?: string;
  VideoUrl?: string;
}

// Banner Interface
export interface Banner {
  BannerId: number;
  BannerName: string;
  Developer?: string;
  BannerDetails?: string;
  DateOfJoining?: string;
  PhotoFileName?: string | string[];
}

// Developer Interface
export interface Developer {
  DeveloperId: number;
  DeveloperName: string;
  DeveloperTitle?: string;
  Description?: string;
  DateOfJoining?: string;
  PhotoFileName?: string | string[];
}

// Project Interface
export interface Project {
  ProjectId: number;
  ProjectName: string;
  Developer?: string;
  ProjectDetails?: string;
  DateOfJoining?: string;
  PhotoFileName?: string | string[];
}

// About/Feature Interface
export interface About {
  AboutId: number;
  Title: string;
  Feature?: string;
  Description?: string;
  DateOfJoining?: string;
  PhotoFileName?: string | string[];
}

// ProtectedRoute Props
export interface ProtectedRouteProps {
  token: string | null;
  children: React.ReactNode;
}
