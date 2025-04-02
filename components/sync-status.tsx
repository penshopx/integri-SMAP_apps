// components/sync-status.tsx
"use client";

import { useState, useEffect } from 'react';
import { CloudOff, CloudIcon as CloudSync, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import syncService from '@/lib/sync-service';
import { useToast } from '@/hooks/use-toast';

export function SyncStatus() {
  const { toast } = useToast();
  const [online, setOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [pendingSyncs, setPendingSyncs] = useState<number>(0);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  
  useEffect(() => {
    const updateOnlineStatus = () => {
      setOnline(navigator.onLine);
    };
    
    const updatePendingSyncs = () => {
      setPendingSyncs(syncService.getPendingSyncCount());
    };
    
    // Initial check
    updateOnlineStatus();
    updatePendingSyncs();
    
    // Add event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Set up a timer to check for pending syncs
    const interval = setInterval(updatePendingSyncs, 5000);
    
    // Auto-sync when coming back online
    const handleBackOnline = () => {
      if (navigator.onLine && pendingSyncs > 0) {
        handleSync();
      }
    };
    
    window.addEventListener('online', handleBackOnline);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      window.removeEventListener('online', handleBackOnline);
      clearInterval(interval);
    };
  }, [pendingSyncs]);
  
  const handleSync = async () => {
    if (!online || syncing) return;
    
    setSyncing(true);
    
    try {
      const result = await syncService.syncAll();
      
      if (result.success) {
        toast({
          title: 'Sinkronisasi Berhasil',
          description: `${result.synced} item berhasil disinkronisasi.`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Sinkronisasi Sebagian',
          description: `${result.synced} item berhasil disinkronisasi. ${result.failed} item gagal.`,
          variant: 'destructive',
        });
      }
      
      // Update pending syncs
      setPendingSyncs(syncService.getPendingSyncCount());
    } catch (error) {
      toast({
        title: 'Sinkronisasi Gagal',
        description: 'Terjadi kesalahan saat sinkronisasi data.',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
      setShowDialog(false);
    }
  };
  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="relative h-8 w-8 p-0"
              onClick={() => pendingSyncs > 0 && setShowDialog(true)}
            >
              {!online ? (
                <CloudOff className="h-4 w-4 text-gray-500" />
              ) : pendingSyncs > 0 ? (
                <CloudSync className="h-4 w-4 text-amber-500" />
              ) : (
                <Check className="h-4 w-4 text-green-500" />
              )}
              
              {pendingSyncs > 0 && (
                <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-amber-500 text-[10px] text-white flex items-center justify-center">
                  {pendingSyncs > 9 ? '9+' : pendingSyncs}
                </span>
              )}
              <span className="sr-only">Status Sinkronisasi</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {!online ? (
              <p>Offline - Perubahan akan disinkronkan saat online</p>
            ) : pendingSyncs > 0 ? (
              <p>{pendingSyncs} perubahan menunggu sinkronisasi</p>
            ) : (
              <p>Semua data telah disinkronkan</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sinkronisasi Data</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {!online ? (
              <div className="flex items-center text-amber-500 mb-4">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p>Anda sedang offline. Sinkronisasi akan dilakukan secara otomatis saat terhubung kembali.</p>
              </div>
            ) : (
              <p>Terdapat {pendingSyncs} perubahan yang belum disinkronkan. Sinkronkan sekarang?</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleSync} disabled={!online || syncing}>
              {syncing ? 'Sinkronisasi...' : 'Sinkronkan Sekarang'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}