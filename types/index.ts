export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface HealthScan {
  id: string;
  userId: string;
  bodyPart: 'skin' | 'eyes' | 'teeth' | 'face' | 'ears' | 'hair' | 'nails';
  imageUrl: string;
  imageBase64?: string;
  analysis: HealthAnalysisResult;
  createdAt: Date;
  notes?: string;
  tags?: string[];
}

export interface HealthAnalysisResult {
  status: 'healthy' | 'issue_detected' | 'needs_attention';
  condition: string;
  confidence: number;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high';
}

export interface WellnessRecommendation {
  id: string;
  userId: string;
  bodyPart: string;
  recommendations: string[];
  createdAt: Date;
  expiresAt?: Date;
}

export interface Reminder {
  id: string;
  userId: string;
  bodyPart: string;
  title: string;
  message: string;
  scheduledFor: Date;
  isCompleted: boolean;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  relatedScanId?: string;
}

export interface ScanComparison {
  id: string;
  userId: string;
  originalScanId: string;
  comparisonScanId: string;
  changes: string[];
  createdAt: Date;
}

export type BodyPart = 'skin' | 'eyes' | 'teeth' | 'face' | 'ears' | 'hair' | 'nails';

export interface ScanType {
  id: BodyPart;
  name: string;
  description: string;
  icon: string;
  color: string;
  instructions: string[];
  recommendedFrequency: string;
}

export interface AppSettings {
  notifications: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'monthly';
  autoSave: boolean;
  privacyMode: boolean;
} 