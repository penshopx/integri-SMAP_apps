// components/document/collaborative-editor.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { useParams, useRouter } from 'next/navigation';
import { marked } from 'marked';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bold, Italic, List, ListOrdered, ChevronDown, Save, Eye, Code, Link, Image, Table, FileText, History } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import documentService from '@/lib/document-service';
import documentRevisionService from '@/lib/document-revision-service';

interface CollaborativeEditorProps {
  documentId: string;
  initialContent?: string;
  readOnly?: boolean;
  onSave?: (content: string) => void;
}

export function CollaborativeEditor({ 
  documentId, 
  initialContent = '', 
  readOnly = false,
  onSave
}: CollaborativeEditorProps) {
  const { authState } = useAuth();
  const router = useRouter();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState(initialContent);
  const [debouncedContent] = useDebounce(content, 1000);
  const [preview, setPreview] = useState('');
  const [activeUsers, setActiveUsers] = useState([{ id: '1', name: 'Admin User' }]);
  const [revisions, setRevisions] = useState([]);
  const [showRevisions, setShowRevisions] = useState(false);
  
  // Update preview when content changes
  useEffect(() => {
    setPreview(marked(debouncedContent));
    
    // Auto-save to local storage
    if (!readOnly && debouncedContent && debouncedContent !== initialContent) {
      localStorage.setItem(`draft_document_${documentId}`, debouncedContent);
    }
  }, [debouncedContent, documentId, initialContent, readOnly]);
  
  // Load revisions
  useEffect(() => {
    if (documentId) {
      const docRevisions = documentRevisionService.getRevisionsByDocumentId(documentId);
      setRevisions(docRevisions);
    }
  }, [documentId]);
  
  const handleSave = () => {
    if (readOnly || !authState.user) return;
    
    // Clear draft
    localStorage.removeItem(`draft_document_${documentId}`);
    
    // Create new revision
    documentRevisionService.createRevision(documentId, {
      version: `1.${revisions.length + 1}`,
      content,
      changes: 'Update content',
      createdBy: authState.user.id,
      status: 'draft',
    });
    
    // Update document
    if (documentId && onSave) {
      onSave(content);
    }
  };
  
  const insertText = (before: string, after: string = '') => {
    if (readOnly || !editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const replacement = before + selectedText + after;
    const newContent = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    
    setContent(newContent);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selectedText.length;
    }, 0);
  };
  
  const handleFormatting = (type: string) => {
    switch (type) {
      case 'bold':
        insertText('**', '**');
        break;
      case 'italic':
        insertText('*', '*');
        break;
      case 'heading':
        insertText('## ');
        break;
      case 'link':
        insertText('[', '](URL)');
        break;
      case 'image':
        insertText('![alt text](', ')');
        break;
      case 'code':
        insertText('```\n', '\n```');
        break;
      case 'list':
        insertText('- ');
        break;
      case 'ordered-list':
        insertText('1. ');
        break;
      case 'table':
        insertText(
          '| Header 1 | Header 2 |\n| --- | --- |\n| Content 1 | Content 2 |\n'
        );
        break;
      default:
        break;
    }
  };
  
  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b p-2 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormatting('bold')}
            disabled={readOnly}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormatting('italic')}
            disabled={readOnly}
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={readOnly}>
                <FileText className="h-4 w-4 mr-1" />
                Heading <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => insertText('# ')}>
                Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertText('## ')}>
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertText('### ')}>
                Heading 3
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormatting('list')}
            disabled={readOnly}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormatting('ordered-list')}
            disabled={readOnly}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormatting('link')}
            disabled={readOnly}
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormatting('image')}
            disabled={readOnly}
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormatting('code')}
            disabled={readOnly}
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormatting('table')}
            disabled={readOnly}
          >
            <Table className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-1">
          {!readOnly && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowRevisions(!showRevisions)}
            >
              <History className="h-4 w-4 mr-1" />
              Revisi
            </Button>
          )}
          {!readOnly && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleSave}
            >
              <Save className="h-4 w-4 mr-1" />
              Simpan
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="edit" className="flex-1">Edit</TabsTrigger>
          <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="p-0">
          <textarea
            ref={editorRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[500px] p-4 resize-none focus:outline-none font-mono"
            placeholder="Tulis konten dokumen di sini menggunakan format Markdown..."
            disabled={readOnly}
          ></textarea>
        </TabsContent>
        
        <TabsContent value="preview" className="p-0">
          <div 
            className="min-h-[500px] p-4 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: preview }}
          ></div>
        </TabsContent>
      </Tabs>
      
      {showRevisions && (
        <div className="border-t p-4 bg-gray-50">
          <h3 className="font-medium mb-2">Riwayat Revisi</h3>
          {revisions.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada revisi</p>
          ) : (
            <ul className="space-y-2">
              {revisions.map((revision: any) => (
                <li key={revision.id} className="text-sm flex justify-between items-center">
                  <div>
                    <span className="font-medium">v{revision.version}</span> - 
                    <span className="ml-1 text-gray-500">
                      {new Date(revision.createdAt).toLocaleString('id-ID')}
                    </span>
                    <span className="ml-2">
                      {revision.status === 'draft' && (
                        <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs">
                          Draft
                        </span>
                      )}
                      {revision.status === 'pending_review' && (
                        <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs">
                          Menunggu Review
                        </span>
                      )}
                      {revision.status === 'approved' && (
                        <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs">
                          Disetujui
                        </span>
                      )}
                    </span>
                  </div>
                  <div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setContent(revision.content)}
                    >
                      Lihat
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}