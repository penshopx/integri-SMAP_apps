// lib/sync-service.ts
interface SyncItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  entity: 'document' | 'assessment' | 'audit' | 'user' | 'risk';
  data: any;
  timestamp: string;
  synced: boolean;
}

class SyncService {
  private getPendingSyncs(): SyncItem[] {
    if (typeof window === "undefined") return [];
    
    try {
      const syncs = localStorage.getItem("pending_syncs");
      return syncs ? JSON.parse(syncs) : [];
    } catch (error) {
      console.error("Error getting pending syncs:", error);
      return [];
    }
  }
  
  private savePendingSyncs(syncs: SyncItem[]): void {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem("pending_syncs", JSON.stringify(syncs));
    } catch (error) {
      console.error("Error saving pending syncs:", error);
    }
  }
  
  addPendingSync(sync: Omit<SyncItem, 'id' | 'timestamp' | 'synced'>): SyncItem {
    const syncs = this.getPendingSyncs();
    
    const newSync: SyncItem = {
      ...sync,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      synced: false,
    };
    
    this.savePendingSyncs([...syncs, newSync]);
    return newSync;
  }
  
  getPendingSyncCount(): number {
    return this.getPendingSyncs().filter(sync => !sync.synced).length;
  }
  
  markAsSynced(syncId: string): boolean {
    const syncs = this.getPendingSyncs();
    const index = syncs.findIndex(sync => sync.id === syncId);
    
    if (index === -1) return false;
    
    syncs[index].synced = true;
    this.savePendingSyncs(syncs);
    
    return true;
  }
  
  clearSyncedItems(): void {
    const syncs = this.getPendingSyncs();
    const pendingSyncs = syncs.filter(sync => !sync.synced);
    this.savePendingSyncs(pendingSyncs);
  }
  
  async syncAll(): Promise<{ success: boolean; synced: number; failed: number }> {
    // In a real app, this would send pending changes to the server
    // For this demo, we'll just simulate the syncing process
    
    const syncs = this.getPendingSyncs().filter(sync => !sync.synced);
    let synced = 0;
    let failed = 0;
    
    for (const sync of syncs) {
      try {
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 90% success rate for demo
        if (Math.random() < 0.9) {
          this.markAsSynced(sync.id);
          synced++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
      }
    }
    
    // Clean up synced items
    this.clearSyncedItems();
    
    return {
      success: failed === 0,
      synced,
      failed,
    };
  }
}

const syncService = new SyncService();
export default syncService;