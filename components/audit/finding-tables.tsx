// components/audit/audit-findings-table.tsx
"use client";

import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AuditFinding, FindingSeverity } from '@/types/audit';
import { useAuth } from '@/contexts/auth-context';

const findingFormSchema = z.object({
  clause: z.string().min(1, { message: 'Klausul harus diisi' }),
  description: z.string().min(1, { message: 'Deskripsi harus diisi' }),
  severity: z.enum(['critical', 'major', 'minor', 'observation']),
  correctionPlan: z.string().optional(),
  responsiblePerson: z.string().optional(),
  dueDate: z.string().optional(),
});

interface AuditFindingsTableProps {
  auditId: string;
  findings: AuditFinding[];
  onAddFinding: (finding: Omit<AuditFinding, 'id' | 'auditId'>) => void;
  onUpdateFinding: (findingId: string, updates: Partial<AuditFinding>) => void;
  onCloseFinding: (findingId: string) => void;
  readOnly?: boolean;
}

export function AuditFindingsTable({
  auditId,
  findings,
  onAddFinding,
  onUpdateFinding,
  onCloseFinding,
  readOnly = false
}: AuditFindingsTableProps) {
  const { authState } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<AuditFinding | null>(null);
  
  const form = useForm<z.infer<typeof findingFormSchema>>({
    resolver: zodResolver(findingFormSchema),
    defaultValues: {
      clause: '',
      description: '',
      severity: 'minor',
      correctionPlan: '',
      responsiblePerson: '',
      dueDate: '',
    },
  });
  
  const handleAddFinding = (values: z.infer<typeof findingFormSchema>) => {
    onAddFinding({
      ...values,
      status: 'open',
    });
    form.reset();
    setIsAddDialogOpen(false);
  };
  
  const handleEditFinding = (finding: AuditFinding) => {
    setSelectedFinding(finding);
    form.reset({
      clause: finding.clause,
      description: finding.description,
      severity: finding.severity,
      correctionPlan: finding.correctionPlan || '',
      responsiblePerson: finding.responsiblePerson || '',
      dueDate: finding.dueDate || '',
    });
  };
  
  const handleUpdateFinding = (values: z.infer<typeof findingFormSchema>) => {
    if (!selectedFinding) return;
    
    onUpdateFinding(selectedFinding.id, values);
    setSelectedFinding(null);
    form.reset();
  };
  
  const getSeverityColor = (severity: FindingSeverity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 hover:bg-red-600';
      case 'major': return 'bg-orange-500 hover:bg-orange-600';
      case 'minor': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'observation': return 'bg-blue-500 hover:bg-blue-600';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'closed': return 'bg-green-100 text-green-800 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Temuan Audit</h3>
        {!readOnly && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Tambah Temuan</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Tambah Temuan Audit</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddFinding)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="clause"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Klausul</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: 8.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Deskripsi temuan..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tingkat Keparahan</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tingkat keparahan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="critical">Kritis</SelectItem>
                            <SelectItem value="major">Mayor</SelectItem>
                            <SelectItem value="minor">Minor</SelectItem>
                            <SelectItem value="observation">Observasi</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="correctionPlan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rencana Perbaikan</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Rencana perbaikan..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="responsiblePerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Penanggung Jawab</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama penanggung jawab" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tenggat Waktu</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Batal</Button>
                    </DialogClose>
                    <Button type="submit">Simpan</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {findings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Belum ada temuan audit
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Klausul</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Tingkat Keparahan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tenggat Waktu</TableHead>
              {!readOnly && <TableHead>Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {findings.map((finding) => (
              <TableRow key={finding.id}>
                <TableCell>{finding.clause}</TableCell>
                <TableCell>{finding.description}</TableCell>
                <TableCell>
                  <Badge className={getSeverityColor(finding.severity)}>
                    {finding.severity === 'critical' && 'Kritis'}
                    {finding.severity === 'major' && 'Mayor'}
                    {finding.severity === 'minor' && 'Minor'}
                    {finding.severity === 'observation' && 'Observasi'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(finding.status)}>
                    {finding.status === 'open' && 'Terbuka'}
                    {finding.status === 'in_progress' && 'Dalam Proses'}
                    {finding.status === 'closed' && 'Ditutup'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {finding.dueDate ? new Date(finding.dueDate).toLocaleDateString('id-ID') : '-'}
                </TableCell>
                {!readOnly && (
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditFinding(finding)}
                      >
                        Edit
                      </Button>
                      {finding.status !== 'closed' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onCloseFinding(finding.id)}
                        >
                          Tutup
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      {/* Dialog untuk edit temuan */}
      {selectedFinding && (
        <Dialog open={!!selectedFinding} onOpenChange={(open) => !open && setSelectedFinding(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Temuan Audit</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdateFinding)} className="space-y-4">
                {/* Form fields sama seperti add dialog */}
                <FormField
                  control={form.control}
                  name="clause"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Klausul</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: 8.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* ... form fields lainnya ... */}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Batal</Button>
                  </DialogClose>
                  <Button type="submit">Perbarui</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}