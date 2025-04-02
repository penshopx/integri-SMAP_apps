// types/audit.ts
export type AuditType = 'internal' | 'external' | 'surveillance' | 'certification';
export type AuditStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';
export type FindingSeverity = 'critical' | 'major' | 'minor' | 'observation';

export interface AuditFinding {
  id: string;
  auditId: string;
  clause: string;
  description: string;
  severity: FindingSeverity;
  correctionPlan?: string;
  responsiblePerson?: string;
  dueDate?: string;
  status: 'open' | 'in_progress' | 'closed';
  closedDate?: string;
  closedBy?: string;
  evidence?: string[];
}

export interface AuditChecklist {
  id: string;
  auditId: string;
  clause: string;
  requirement: string;
  result: 'conformity' | 'non_conformity' | 'not_applicable' | 'not_verified';
  evidence?: string;
  notes?: string;
}

export interface Audit {
  id: string;
  title: string;
  type: AuditType;
  scope: string;
  startDate: string;
  endDate: string;
  status: AuditStatus;
  leadAuditor: string;
  auditTeam: string[];
  auditees: string[];
  objectives: string[];
  findings: AuditFinding[];
  checklist: AuditChecklist[];
  conclusion?: string;
  attachments?: string[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

// lib/audit-service.ts (tambahan metode)
class AuditService {
  // ... metode yang sudah ada
  
  // Metode untuk mengelola temuan audit
  addFinding(auditId: string, finding: Omit<AuditFinding, 'id' | 'auditId'>): AuditFinding {
    const audit = this.getAuditById(auditId);
    if (!audit) throw new Error("Audit not found");
    
    const newFinding: AuditFinding = {
      ...finding,
      id: Date.now().toString(),
      auditId,
    };
    
    audit.findings.push(newFinding);
    this.updateAudit(auditId, { findings: audit.findings });
    
    return newFinding;
  }
  
  updateFinding(auditId: string, findingId: string, updates: Partial<AuditFinding>): AuditFinding | null {
    const audit = this.getAuditById(auditId);
    if (!audit) return null;
    
    const findingIndex = audit.findings.findIndex(f => f.id === findingId);
    if (findingIndex === -1) return null;
    
    const updatedFinding = {
      ...audit.findings[findingIndex],
      ...updates,
    };
    
    audit.findings[findingIndex] = updatedFinding;
    this.updateAudit(auditId, { findings: audit.findings });
    
    return updatedFinding;
  }
  
  closeFinding(auditId: string, findingId: string, userId: string, evidence?: string[]): AuditFinding | null {
    return this.updateFinding(auditId, findingId, {
      status: 'closed',
      closedDate: new Date().toISOString(),
      closedBy: userId,
      evidence: evidence || [],
    });
  }
  
  // Metode untuk mengelola checklist audit
  addChecklistItem(auditId: string, item: Omit<AuditChecklist, 'id' | 'auditId'>): AuditChecklist {
    const audit = this.getAuditById(auditId);
    if (!audit) throw new Error("Audit not found");
    
    const newItem: AuditChecklist = {
      ...item,
      id: Date.now().toString(),
      auditId,
    };
    
    audit.checklist.push(newItem);
    this.updateAudit(auditId, { checklist: audit.checklist });
    
    return newItem;
  }
  
  updateChecklistItem(auditId: string, itemId: string, updates: Partial<AuditChecklist>): AuditChecklist | null {
    const audit = this.getAuditById(auditId);
    if (!audit) return null;
    
    const itemIndex = audit.checklist.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return null;
    
    const updatedItem = {
      ...audit.checklist[itemIndex],
      ...updates,
    };
    
    audit.checklist[itemIndex] = updatedItem;
    this.updateAudit(auditId, { checklist: audit.checklist });
    
    return updatedItem;
  }
  
  // Metode untuk menghasilkan laporan audit
  generateAuditReport(auditId: string): any {
    const audit = this.getAuditById(auditId);
    if (!audit) throw new Error("Audit not found");
    
    // Hitung statistik
    const findingStats = {
      critical: audit.findings.filter(f => f.severity === 'critical').length,
      major: audit.findings.filter(f => f.severity === 'major').length,
      minor: audit.findings.filter(f => f.severity === 'minor').length,
      observation: audit.findings.filter(f => f.severity === 'observation').length,
    };
    
    const checklistStats = {
      conformity: audit.checklist.filter(c => c.result === 'conformity').length,
      nonConformity: audit.checklist.filter(c => c.result === 'non_conformity').length,
      notApplicable: audit.checklist.filter(c => c.result === 'not_applicable').length,
      notVerified: audit.checklist.filter(c => c.result === 'not_verified').length,
    };
    
    // Hitung skor kepatuhan
    const totalApplicableItems = checklistStats.conformity + checklistStats.nonConformity;
    const complianceScore = totalApplicableItems > 0 
      ? Math.round((checklistStats.conformity / totalApplicableItems) * 100) 
      : 0;
    
    return {
      audit,
      findingStats,
      checklistStats,
      complianceScore,
      reportGeneratedAt: new Date().toISOString(),
    };
  }
}