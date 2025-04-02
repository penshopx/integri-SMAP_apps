// types/document-revision.ts
export interface DocumentRevision {
  id: string;
  documentId: string;
  version: string;
  content: string;
  changes: string;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'draft' | 'pending_review' | 'reviewed' | 'approved' | 'rejected';
  comments?: DocumentComment[];
}

export interface DocumentComment {
  id: string;
  revisionId: string;
  userId: string;
  content: string;
  createdAt: string;
  resolvedBy?: string;
  resolvedAt?: string;
  isResolved: boolean;
}

// lib/document-revision-service.ts
import { DocumentRevision, DocumentComment } from '@/types/document-revision';

class DocumentRevisionService {
  private getDocumentRevisions(documentId: string): DocumentRevision[] {
    if (typeof window === "undefined") return [];
    
    try {
      const revisions = localStorage.getItem(`document_revisions_${documentId}`);
      return revisions ? JSON.parse(revisions) : [];
    } catch (error) {
      console.error("Error getting document revisions:", error);
      return [];
    }
  }
  
  private saveDocumentRevisions(documentId: string, revisions: DocumentRevision[]): void {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(`document_revisions_${documentId}`, JSON.stringify(revisions));
    } catch (error) {
      console.error("Error saving document revisions:", error);
    }
  }
  
  getRevisionsByDocumentId(documentId: string): DocumentRevision[] {
    return this.getDocumentRevisions(documentId);
  }
  
  getRevisionById(documentId: string, revisionId: string): DocumentRevision | null {
    const revisions = this.getDocumentRevisions(documentId);
    return revisions.find(rev => rev.id === revisionId) || null;
  }
  
  createRevision(documentId: string, revision: Omit<DocumentRevision, 'id' | 'documentId' | 'createdAt' | 'comments'>): DocumentRevision {
    const revisions = this.getDocumentRevisions(documentId);
    
    const newRevision: DocumentRevision = {
      ...revision,
      id: Date.now().toString(),
      documentId,
      createdAt: new Date().toISOString(),
      comments: [],
    };
    
    this.saveDocumentRevisions(documentId, [...revisions, newRevision]);
    return newRevision;
  }
  
  updateRevisionStatus(documentId: string, revisionId: string, status: DocumentRevision['status'], userId: string): DocumentRevision | null {
    const revisions = this.getDocumentRevisions(documentId);
    const index = revisions.findIndex(rev => rev.id === revisionId);
    
    if (index === -1) return null;
    
    const updatedRevision = { ...revisions[index], status };
    
    // If approving, add approval info
    if (status === 'approved' && !updatedRevision.approvedAt) {
      updatedRevision.approvedBy = userId;
      updatedRevision.approvedAt = new Date().toISOString();
    }
    
    revisions[index] = updatedRevision;
    this.saveDocumentRevisions(documentId, revisions);
    
    return updatedRevision;
  }
  
  // Metode untuk mengelola komentar
  addComment(documentId: string, revisionId: string, comment: Omit<DocumentComment, 'id' | 'revisionId' | 'createdAt' | 'isResolved'>): DocumentComment | null {
    const revisions = this.getDocumentRevisions(documentId);
    const revisionIndex = revisions.findIndex(rev => rev.id === revisionId);
    
    if (revisionIndex === -1) return null;
    
    const newComment: DocumentComment = {
      ...comment,
      id: Date.now().toString(),
      revisionId,
      createdAt: new Date().toISOString(),
      isResolved: false,
    };
    
    if (!revisions[revisionIndex].comments) {
      revisions[revisionIndex].comments = [];
    }
    
    revisions[revisionIndex].comments!.push(newComment);
    this.saveDocumentRevisions(documentId, revisions);
    
    return newComment;
  }
  
  resolveComment(documentId: string, revisionId: string, commentId: string, userId: string): DocumentComment | null {
    const revisions = this.getDocumentRevisions(documentId);
    const revisionIndex = revisions.findIndex(rev => rev.id === revisionId);
    
    if (revisionIndex === -1 || !revisions[revisionIndex].comments) return null;
    
    const commentIndex = revisions[revisionIndex].comments!.findIndex(c => c.id === commentId);
    
    if (commentIndex === -1) return null;
    
    const updatedComment: DocumentComment = {
      ...revisions[revisionIndex].comments![commentIndex],
      isResolved: true,
      resolvedBy: userId,
      resolvedAt: new Date().toISOString(),
    };
    
    revisions[revisionIndex].comments![commentIndex] = updatedComment;
    this.saveDocumentRevisions(documentId, revisions);
    
    return updatedComment;
  }
  
  // Metode untuk membandingkan revisi
  compareRevisions(documentId: string, revisionId1: string, revisionId2: string): { additions: string[]; deletions: string[]; } {
    const revision1 = this.getRevisionById(documentId, revisionId1);
    const revision2 = this.getRevisionById(documentId, revisionId2);
    
    if (!revision1 || !revision2) {
      return { additions: [], deletions: [] };
    }
    
    // Dalam aplikasi nyata, ini akan menggunakan algoritma diff yang lebih canggih
    // Untuk demo, kita akan menggunakan pendekatan sederhana
    const content1Lines = revision1.content.split('\n');
    const content2Lines = revision2.content.split('\n');
    
    const additions = content2Lines.filter(line => !content1Lines.includes(line));
    const deletions = content1Lines.filter(line => !content2Lines.includes(line));
    
    return { additions, deletions };
  }
}

const documentRevisionService = new DocumentRevisionService();
export default documentRevisionService;