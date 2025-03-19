"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal, Eye, Download, FileText } from 'lucide-react';

// Tipe data untuk dokumen
interface Document {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  fileUrl: string;
}

// Props untuk komponen DocumentTable
interface DocumentTableProps {
  documents: Document[];
}

export function DocumentTable({ documents }: DocumentTableProps) {
  const [sortColumn, setSortColumn] = useState<keyof Document>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Fungsi untuk mengurutkan dokumen
  const sortedDocuments = [...documents].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Fungsi untuk mengubah kolom pengurutan
  const toggleSort = (column: keyof Document) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Fungsi untuk mendapatkan warna badge berdasarkan status dokumen
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-500 hover:bg-gray-600";
      case "review":
        return "bg-blue-500 hover:bg-blue-600";
      case "approved":
        return "bg-green-500 hover:bg-green-600";
      case "published":
        return "bg-purple-500 hover:bg-purple-600";
      case "archived":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // Fungsi untuk mendapatkan label tipe dokumen
  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "policy":
        return "Kebijakan";
      case "procedure":
        return "Prosedur";
      case "form":
        return "Formulir";
      case "record":
        return "Catatan";
      case "report":
        return "Laporan";
      default:
        return type;
    }
  };

  // Fungsi untuk mendapatkan label status dokumen
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "review":
        return "Dalam Review";
      case "approved":
        return "Disetujui";
      case "published":
        return "Dipublikasikan";
      case "archived":
        return "Diarsipkan";
      default:
        return status;
    }
  };

  // Fungsi untuk melihat preview dokumen
  const handlePreview = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  // Fungsi untuk mengunduh dokumen
  const handleDownload = (document: Document) => {
    // Dalam implementasi nyata, ini akan mengunduh file dari URL
    console.log("Downloading document:", document.title);
    window.open(document.fileUrl, "_blank");
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("title")}
              >
                Judul Dokumen
                {sortColumn === "title" && (
                  <span className="ml-2">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("type")}
              >
                Tipe
                {sortColumn === "type" && (
                  <span className="ml-2">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("updatedAt")}
              >
                Terakhir Diperbarui
                {sortColumn === "updatedAt" && (
                  <span className="ml-2">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("status")}
              >
                Status
                {sortColumn === "status" && (
                  <span className="ml-2">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Tidak ada dokumen yang ditemukan
                </TableCell>
              </TableRow>
            ) : (
              sortedDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">{document.title}</TableCell>
                  <TableCell>{getDocumentTypeLabel(document.type)}</TableCell>
                  <TableCell>{new Date(document.updatedAt).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(document.status)}>
                      {getStatusLabel(document.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Buka menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handlePreview(document)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(document)}>
                          <Download className="mr-2 h-4 w-4" />
                          Unduh
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => window.location.href = `/documents/${document.id}`}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Detail Dokumen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog untuk preview dokumen */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDocument?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Badge className="mr-2">
                  {selectedDocument && getDocumentTypeLabel(selectedDocument.type)}
                </Badge>
                <Badge className={selectedDocument ? getStatusColor(selectedDocument.status) : ""}>
                  {selectedDocument && getStatusLabel(selectedDocument.status)}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectedDocument && handleDownload(selectedDocument)}
              >
                <Download className="mr-2 h-4 w-4" />
                Unduh
              </Button>
            </div>
            <div className="border rounded-md p-4 bg-gray-50 min-h-[300px]">
              {/* Dalam implementasi nyata, ini akan menampilkan preview dokumen */}
              <div className="text-center text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-2" />
                <p>Preview dokumen akan ditampilkan di sini.</p>
                <p className="text-sm">
                  Dalam implementasi nyata, ini akan menampilkan preview dokumen yang sebenarnya.
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Dibuat pada: {selectedDocument && new Date(selectedDocument.createdAt).toLocaleDateString("id-ID")}</p>
              <p>Terakhir diperbarui: {selectedDocument && new Date(selectedDocument.updatedAt).toLocaleDateString("id-ID")}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}