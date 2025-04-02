// types/risk.ts
export type RiskLevel = 'high' | 'medium' | 'low';
export type RiskCategory = 'operational' | 'financial' | 'compliance' | 'reputation' | 'strategic';
export type RiskStatus = 'identified' | 'assessed' | 'mitigated' | 'monitored' | 'closed';

export interface RiskAssessment {
  id: string;
  riskId: string;
  likelihood: number; // 1-5
  impact: number; // 1-5
  inherentRiskScore: number;
  residualRiskScore: number;
  assessedBy: string;
  assessedAt: string;
  notes?: string;
}

export interface RiskMitigation {
  id: string;
  riskId: string;
  description: string;
  responsiblePerson: string;
  dueDate: string;
  status: 'planned' | 'in_progress' | 'completed' | 'overdue';
  completedDate?: string;
  completedBy?: string;
  effectiveness?: number; // 1-5
  notes?: string;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  level: RiskLevel;
  status: RiskStatus;
  owner: string;
  identifiedDate: string;
  identifiedBy: string;
  relatedClause?: string;
  relatedProcess?: string;
  assessments: RiskAssessment[];
  mitigations: RiskMitigation[];
  lastReviewDate?: string;
  nextReviewDate?: string;
  createdAt: string;
  updatedAt: string;
}

// lib/risk-service.ts
import { Risk, RiskAssessment, RiskMitigation, RiskLevel } from '@/types/risk';

class RiskService {
  private getRisks(): Risk[] {
    if (typeof window === "undefined") return [];
    
    try {
      const risks = localStorage.getItem("smap_risks");
      return risks ? JSON.parse(risks) : [];
    } catch (error) {
      console.error("Error getting risks:", error);
      return [];
    }
  }
  
  private saveRisks(risks: Risk[]): void {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem("smap_risks", JSON.stringify(risks));
    } catch (error) {
      console.error("Error saving risks:", error);
    }
  }
  
  getAllRisks(): Risk[] {
    return this.getRisks();
  }
  
  getRiskById(id: string): Risk | null {
    const risks = this.getRisks();
    return risks.find(risk => risk.id === id) || null;
  }
  
  getRisksByLevel(level: RiskLevel): Risk[] {
    const risks = this.getRisks();
    return risks.filter(risk => risk.level === level);
  }
  
  getRisksByCategory(category: string): Risk[] {
    const risks = this.getRisks();
    return risks.filter(risk => risk.category === category);
  }
  
  createRisk(risk: Omit<Risk, 'id' | 'assessments' | 'mitigations' | 'createdAt' | 'updatedAt'>): Risk {
    const risks = this.getRisks();
    
    const newRisk: Risk = {
      ...risk,
      id: Date.now().toString(),
      assessments: [],
      mitigations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.saveRisks([...risks, newRisk]);
    return newRisk;
  }
  
  updateRisk(id: string, updates: Partial<Risk>): Risk | null {
    const risks = this.getRisks();
    const index = risks.findIndex(risk => risk.id === id);
    
    if (index === -1) return null;
    
    const updatedRisk: Risk = {
      ...risks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    risks[index] = updatedRisk;
    this.saveRisks(risks);
    
    return updatedRisk;
  }
  
  deleteRisk(id: string): boolean {
    const risks = this.getRisks();
    const filteredRisks = risks.filter(risk => risk.id !== id);
    
    if (filteredRisks.length === risks.length) return false;
    
    this.saveRisks(filteredRisks);
    return true;
  }
  
  // Metode untuk mengelola penilaian risiko
  addRiskAssessment(riskId: string, assessment: Omit<RiskAssessment, 'id' | 'riskId'>): RiskAssessment | null {
    const risk = this.getRiskById(riskId);
    if (!risk) return null;
    
    const newAssessment: RiskAssessment = {
      ...assessment,
      id: Date.now().toString(),
      riskId,
    };
    
    risk.assessments.push(newAssessment);
    
    // Update risk level based on assessment
    const inherentRiskScore = newAssessment.inherentRiskScore;
    let level: RiskLevel = 'low';
    
    if (inherentRiskScore >= 15) {
      level = 'high';
    } else if (inherentRiskScore >= 8) {
      level = 'medium';
    }
    
    this.updateRisk(riskId, { 
      level, 
      status: 'assessed',
      lastReviewDate: new Date().toISOString(),
      assessments: risk.assessments,
    });
    
    return newAssessment;
  }
  
  // Metode untuk mengelola mitigasi risiko
  addRiskMitigation(riskId: string, mitigation: Omit<RiskMitigation, 'id' | 'riskId'>): RiskMitigation | null {
    const risk = this.getRiskById(riskId);
    if (!risk) return null;
    
    const newMitigation: RiskMitigation = {
      ...mitigation,
      id: Date.now().toString(),
      riskId,
    };
    
    risk.mitigations.push(newMitigation);
    
    this.updateRisk(riskId, { 
      status: 'mitigated',
      mitigations: risk.mitigations,
    });
    
    return newMitigation;
  }
  
  updateRiskMitigation(riskId: string, mitigationId: string, updates: Partial<RiskMitigation>): RiskMitigation | null {
    const risk = this.getRiskById(riskId);
    if (!risk) return null;
    
    const mitigationIndex = risk.mitigations.findIndex(m => m.id === mitigationId);
    if (mitigationIndex === -1) return null;
    
    const updatedMitigation: RiskMitigation = {
      ...risk.mitigations[mitigationIndex],
      ...updates,
    };
    
    risk.mitigations[mitigationIndex] = updatedMitigation;
    
    // If mitigation is completed, update risk status
    if (updatedMitigation.status === 'completed' && !updatedMitigation.completedDate) {
      updatedMitigation.completedDate = new Date().toISOString();
    }
    
    this.updateRisk(riskId, { mitigations: risk.mitigations });
    
    return updatedMitigation;
  }
  
  // Metode untuk menghasilkan laporan risiko
  generateRiskReport(): any {
    const risks = this.getRisks();
    
    const risksByLevel = {
      high: risks.filter(r => r.level === 'high').length,
      medium: risks.filter(r => r.level === 'medium').length,
      low: risks.filter(r => r.level === 'low').length,
    };
    
    const risksByCategory = [
      { name: 'Operasional', value: risks.filter(r => r.category === 'operational').length },
      { name: 'Keuangan', value: risks.filter(r => r.category === 'financial').length },
      { name: 'Kepatuhan', value: risks.filter(r => r.category === 'compliance').length },
      { name: 'Reputasi', value: risks.filter(r => r.category === 'reputation').length },
      { name: 'Strategis', value: risks.filter(r => r.category === 'strategic').length },
    ];
    
    const risksByStatus = {
      identified: risks.filter(r => r.status === 'identified').length,
      assessed: risks.filter(r => r.status === 'assessed').length,
      mitigated: risks.filter(r => r.status === 'mitigated').length,
      monitored: risks.filter(r => r.status === 'monitored').length,
      closed: risks.filter(r => r.status === 'closed').length,
    };
    
    const topRisks = risks
      .filter(r => r.level === 'high')
      .sort((a, b) => {
        const aScore = a.assessments.length > 0 ? a.assessments[a.assessments.length - 1].inherentRiskScore : 0;
        const bScore = b.assessments.length > 0 ? b.assessments[b.assessments.length - 1].inherentRiskScore : 0;
        return bScore - aScore;
      })
      .slice(0, 5);
    
    return {
      totalRisks: risks.length,
      risksByLevel,
      risksByCategory,
      risksByStatus,
      topRisks,
      reportGeneratedAt: new Date().toISOString(),
    };
  }
}

const riskService = new RiskService();
export default riskService;