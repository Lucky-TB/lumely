import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LocalScanData {
  id: string;
  bodyPart: string;
  imageUri: string; // Local file URI instead of Firebase URL
  analysis: {
    status: 'healthy' | 'issue_detected' | 'needs_attention';
    condition: string;
    confidence: number;
    recommendations: string[];
    urgency: 'low' | 'medium' | 'high';
  };
  createdAt: Date;
}

const SCANS_STORAGE_KEY = '@lumely_scans';

export const localStorageService = {
  // Save a new scan to local storage
  async saveScan(scanData: Omit<LocalScanData, 'id' | 'createdAt'>): Promise<string> {
    try {
      const id = Date.now().toString();
      const scan: LocalScanData = {
        ...scanData,
        id,
        createdAt: new Date(),
      };

      // Get existing scans
      const existingScans = await this.getScans();
      
      // Add new scan to the beginning (most recent first)
      const updatedScans = [scan, ...existingScans];
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(updatedScans));
      
      console.log('LocalStorage - Scan saved successfully:', id);
      return id;
    } catch (error) {
      console.error('LocalStorage - Error saving scan:', error);
      throw error;
    }
  },

  // Get all scans from local storage
  async getScans(): Promise<LocalScanData[]> {
    try {
      const scansJson = await AsyncStorage.getItem(SCANS_STORAGE_KEY);
      if (!scansJson) {
        return [];
      }
      
      const scans = JSON.parse(scansJson);
      // Convert createdAt strings back to Date objects
      return scans.map((scan: any) => ({
        ...scan,
        createdAt: new Date(scan.createdAt),
      }));
    } catch (error) {
      console.error('LocalStorage - Error getting scans:', error);
      return [];
    }
  },

  // Delete a scan by ID
  async deleteScan(scanId: string): Promise<void> {
    try {
      const scans = await this.getScans();
      const updatedScans = scans.filter(scan => scan.id !== scanId);
      await AsyncStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(updatedScans));
      console.log('LocalStorage - Scan deleted successfully:', scanId);
    } catch (error) {
      console.error('LocalStorage - Error deleting scan:', error);
      throw error;
    }
  },

  // Clear all scans
  async clearAllScans(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SCANS_STORAGE_KEY);
      console.log('LocalStorage - All scans cleared');
    } catch (error) {
      console.error('LocalStorage - Error clearing scans:', error);
      throw error;
    }
  },

  // Get scan statistics
  async getScanStats(): Promise<{
    total: number;
    healthy: number;
    needsAttention: number;
    issueDetected: number;
  }> {
    try {
      const scans = await this.getScans();
      return {
        total: scans.length,
        healthy: scans.filter(s => s.analysis.status === 'healthy').length,
        needsAttention: scans.filter(s => s.analysis.status === 'needs_attention').length,
        issueDetected: scans.filter(s => s.analysis.status === 'issue_detected').length,
      };
    } catch (error) {
      console.error('LocalStorage - Error getting stats:', error);
      return {
        total: 0,
        healthy: 0,
        needsAttention: 0,
        issueDetected: 0,
      };
    }
  },
}; 