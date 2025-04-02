// types/document.ts
export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  content: string;
  createdBy: string;
  createdAt: string;
  comment: string;
}

// lib/document-service.ts
// Tambahkan metode untuk versioning
createDocumentVersion(documentId: string, content: string, userId: string, comment: string): DocumentVersion {
  const document = this.getDocumentById(documentId);
  if (!document) throw new Error("Document not found");
  
  const versions = this.getDocumentVersions(documentId);
  const newVersion: DocumentVersion = {
    id: Date.now().toString(),
    documentId,
    version: versions.length + 1,
    content,
    createdBy: userId,
    createdAt: new Date().toISOString(),
    comment
  };
  
  // Simpan versi baru
  localStorage.setItem(`document_versions_${documentId}`, 
    JSON.stringify([...versions, newVersion]));
  
  // Update dokumen utama
  document.lastUpdated = newVersion.createdAt;
  document.lastUpdatedBy = userId;
  document.currentVersion = newVersion.version;
  this.updateDocument(documentId, document);
  
  return newVersion;
}

getDocumentVersions(documentId: string): DocumentVersion[] {
  const versionsJson = localStorage.getItem(`document_versions_${documentId}`);
  return versionsJson ? JSON.parse(versionsJson) : [];
}
// types/document.ts
export type ApprovalStatus = 'draft' | 'pending_review' | 'reviewed' | 'pending_approval' | 'approved' | 'rejected';

export interface ApprovalStep {
  id: string;
  documentId: string;
  status: ApprovalStatus;
  assignedTo: string;
  completedBy?: string;
  completedAt?: string;
  comments?: string;
}

export interface ApprovalWorkflow {
  id: string;
  documentId: string;
  currentStep: number;
  steps: ApprovalStep[];
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// lib/approval-service.ts
class ApprovalService {
  createWorkflow(documentId: string, approvers: string[]): ApprovalWorkflow {
    const steps: ApprovalStep[] = approvers.map((approverId, index) => ({
      id: `step_${Date.now()}_${index}`,
      documentId,
      status: index === 0 ? 'pending_review' : 'draft',
      assignedTo: approverId
    }));
    
    const workflow: ApprovalWorkflow = {
      id: Date.now().toString(),
      documentId,
      currentStep: 0,
      steps,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(`workflow_${documentId}`, JSON.stringify(workflow));
    return workflow;
  }
  
  approveStep(workflowId: string, stepId: string, userId: string, comments?: string): ApprovalWorkflow {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) throw new Error("Workflow not found");
    
    const stepIndex = workflow.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) throw new Error("Step not found");
    
    const step = workflow.steps[stepIndex];
    if (step.assignedTo !== userId) throw new Error("Not authorized to approve this step");
    
    // Update current step
    step.status = 'approved';
    step.completedBy = userId;
    step.completedAt = new Date().toISOString();
    step.comments = comments;
    
    // Move to next step if available
    if (stepIndex < workflow.steps.length - 1) {
      workflow.currentStep = stepIndex + 1;
      workflow.steps[stepIndex + 1].status = 'pending_review';
    } else {
      workflow.isCompleted = true;
      
      // Update document status to approved
      const documentService = new DocumentService();
      documentService.updateDocument(workflow.documentId, { status: 'approved' });
    }
    
    workflow.updatedAt = new Date().toISOString();
    localStorage.setItem(`workflow_${workflow.documentId}`, JSON.stringify(workflow));
    
    return workflow;
  }
  
  rejectStep(workflowId: string, stepId: string, userId: string, comments: string): ApprovalWorkflow {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) throw new Error("Workflow not found");
    
    const stepIndex = workflow.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) throw new Error("Step not found");
    
    const step = workflow.steps[stepIndex];
    if (step.assignedTo !== userId) throw new Error("Not authorized to reject this step");
    
    // Update step
    step.status = 'rejected';
    step.completedBy = userId;
    step.completedAt = new Date().toISOString();
    step.comments = comments;
    
    // Mark workflow as completed (rejected)
    workflow.isCompleted = true;
    
    // Update document status to rejected
    const documentService = new DocumentService();
    documentService.updateDocument(workflow.documentId, { status: 'rejected' });
    
    workflow.updatedAt = new Date().toISOString();
    localStorage.setItem(`workflow_${workflow.documentId}`, JSON.stringify(workflow));
    
    return workflow;
  }
  
  getWorkflow(workflowId: string): ApprovalWorkflow | null {
    // In a real app, you would look up by workflow ID
    // For this demo, we'll assume workflowId is the documentId
    const workflowJson = localStorage.getItem(`workflow_${workflowId}`);
    return workflowJson ? JSON.parse(workflowJson) : null;
  }
}

getDocumentVersion(documentId: string, version: number): DocumentVersion | null {
  const versions = this.getDocumentVersions(documentId);
  return versions.find(v => v.version === version) || null;
}