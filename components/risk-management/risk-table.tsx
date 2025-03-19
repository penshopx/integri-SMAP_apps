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
import { MoreHorizontal, Edit, Trash, Eye } from 'lucide-react';

// Tipe data untuk risiko
interface Risk {
  id: string;
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  likelihood: "low" | "medium" | "high";
  status: "identified" | "mitigated" | "accepted" | "transferred";
  createdAt: string;
}

// Props untuk komponen RiskTable
interface RiskTableProps {
  risks: Risk[];
  onView: (risk: Risk) => void;
  onEdit: (risk: Risk) => void;
  onDelete: (risk: Risk) => void;
}

export function RiskTable({ risks, onView, onEdit, onDelete }: RiskTableProps) {
  const [sortColumn, setSortColumn] = useState<keyof Risk>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fungsi untuk mengurutkan risiko
  const sortedRisks = [...risks].sort((a, b) => {
    if (sortColumn === "impact" || sortColumn === "likelihood") {
      const order = { low: 1, medium: 2, high: 3 };
      const aValue = order[a[sortColumn] as keyof typeof order];
      const bValue = order[b[sortColumn] as keyof typeof order];
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Fungsi untuk mengubah kolom pengurutan
  const toggleSort = (column: keyof Risk) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Fungsi untuk mendapatkan warna badge berdasarkan tingkat risiko
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-500 hover:bg-red-600";
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "low":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // Fungsi untuk mendapatkan warna badge berdasarkan status risiko
  const getStatusColor = (status: string) => {
    switch (status) {
      case "identified":
        return "bg-blue-500 hover:bg-blue-600";
      case "mitigated":
        return "bg-green-500 hover:bg-green-600";
      case "accepted":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "transferred":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => toggleSort("title")}
            >
              Judul Risiko
              {sortColumn === "title" && (
                <span className="ml-2">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => toggleSort("impact")}
            >
              Dampak
              {sortColumn === "impact" && (
                <span className="ml-2">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => toggleSort("likelihood")}
            >
              Kemungkinan
              {sortColumn === "likelihood" && (
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
          {sortedRisks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Tidak ada data risiko
              </TableCell>
            </TableRow>
          ) : (
            sortedRisks.map((risk) => (
              <TableRow key={risk.id}>
                <TableCell className="font-medium">{risk.title}</TableCell>
                <TableCell>
                  <Badge className={getImpactColor(risk.impact)}>
                    {risk.impact === "high"
                      ? "Tinggi"
                      : risk.impact === "medium"
                      ? "Sedang"
                      : "Rendah"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getImpactColor(risk.likelihood)}>
                    {risk.likelihood === "high"
                      ? "Tinggi"
                      : risk.likelihood === "medium"
                      ? "Sedang"
                      : "Rendah"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(risk.status)}>
                    {risk.status === "identified"
                      ? "Teridentifikasi"
                      : risk.status === "mitigated"
                      ? "Dimitigasi"
                      : risk.status === "accepted"
                      ? "Diterima"
                      : "Ditransfer"}
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
                      <DropdownMenuItem onClick={() => onView(risk)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(risk)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete(risk)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Hapus
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
  );
}