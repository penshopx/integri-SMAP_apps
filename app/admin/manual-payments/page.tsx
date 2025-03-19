"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal, Eye, Check, X, Search, FileText } from 'lucide-react';

// Data dummy untuk pembayaran manual
const dummyPayments = [
  {
    id: "1",
    orderNumber: "ORD-2023-001",
    customerName: "PT Maju Bersama",
    amount: "Rp 3.000.000",
    paymentDate: "2023-07-15",
    status: "pending",
    proofUrl: "#",
  },
  {
    id: "2",
    orderNumber: "ORD-2023-002",
    customerName: "CV Sukses Mandiri",
    amount: "Rp 1.500.000",
    paymentDate: "2023-07-18",
    status: "verified",
    proofUrl: "#",
  },
  {
    id: "3",
    orderNumber: "ORD-2023-003",
    customerName: "PT Teknologi Nusantara",
    amount: "Rp 5.000.000",
    paymentDate: "2023-07-20",
    status: "pending",
    proofUrl: "#",
  },
  {
    id: "4",
    orderNumber: "ORD-2023-004",
    customerName: "Yayasan Pendidikan Indonesia",
    amount: "Rp 3.000.000",
    paymentDate: "2023-07-22",
    status: "rejected",
    proofUrl: "#",
    rejectionReason: "Jumlah transfer tidak sesuai dengan total pesanan",
  },
  {
    id: "5",
    orderNumber: "ORD-2023-005",
    customerName: "PT Konstruksi Jaya",
    amount: "Rp 1.500.000",
    paymentDate: "2023-07-25",
    status: "verified",
    proofUrl: "#",
  },
];

export default function ManualPaymentsPage() {
  const [payments, setPayments] = useState(dummyPayments);
  const [filteredPayments, setFilteredPayments] = useState(dummyPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Handler untuk pencarian
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      filterPaymentsByStatus(activeTab);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = payments.filter(
      (payment) =>
        payment.orderNumber.toLowerCase().includes(lowercaseQuery) ||
        payment.customerName.toLowerCase().includes(lowercaseQuery)
    );

    setFilteredPayments(filtered);
  };

  // Handler untuk filter berdasarkan status
  const filterPaymentsByStatus = (status: string) => {
    setActiveTab(status);
    if (status === "all") {
      setFilteredPayments(payments);
    } else {
      const filtered = payments.filter((payment) => payment.status === status);
      setFilteredPayments(filtered);
    }
  };

  // Handler untuk melihat detail pembayaran
  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment);
    setIsViewDialogOpen(true);
  };

  // Handler untuk verifikasi pembayaran
  const handleVerifyPayment = (paymentId: string) => {
    const updatedPayments = payments.map((payment) =>
      payment.id === paymentId ? { ...payment, status: "verified" } : payment
    );
    setPayments(updatedPayments);
    filterPaymentsByStatus(activeTab);
    setIsViewDialogOpen(false);
  };

  // Handler untuk menolak pembayaran
  const handleRejectPayment = (paymentId: string, reason: string) => {
    const updatedPayments = payments.map((payment) =>
      payment.id === paymentId
        ? { ...payment, status: "rejected", rejectionReason: reason }
        : payment
    );
    setPayments(updatedPayments);
    filterPaymentsByStatus(activeTab);
    setIsViewDialogOpen(false);
  };

  // Fungsi untuk mendapatkan warna badge berdasarkan status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Menunggu Verifikasi</Badge>;
      case "verified":
        return <Badge className="bg-green-500">Terverifikasi</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Ditolak</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pembayaran Manual</h1>
          <p className="text-muted-foreground">
            Kelola dan verifikasi pembayaran manual dari pelanggan
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pesanan..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={filterPaymentsByStatus}>
        <TabsList>
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="pending">Menunggu Verifikasi</TabsTrigger>
          <TabsTrigger value="verified">Terverifikasi</TabsTrigger>
          <TabsTrigger value="rejected">Ditolak</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <PaymentsTable
            payments={filteredPayments}
            getStatusBadge={getStatusBadge}
            onViewPayment={handleViewPayment}
          />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <PaymentsTable
            payments={filteredPayments}
            getStatusBadge={getStatusBadge}
            onViewPayment={handleViewPayment}
          />
        </TabsContent>
        <TabsContent value="verified" className="mt-4">
          <PaymentsTable
            payments={filteredPayments}
            getStatusBadge={getStatusBadge}
            onViewPayment={handleViewPayment}
          />
        </TabsContent>
        <TabsContent value="rejected" className="mt-4">
          <PaymentsTable
            payments={filteredPayments}
            getStatusBadge={getStatusBadge}
            onViewPayment={handleViewPayment}
          />
        </TabsContent>
      </Tabs>

      {/* Dialog untuk melihat detail pembayaran */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detail Pembayaran</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Nomor Pesanan</h3>
                  <p>{selectedPayment.orderNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <div>{getStatusBadge(selectedPayment.status)}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Pelanggan</h3>
                  <p>{selectedPayment.customerName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Jumlah</h3>
                  <p>{selectedPayment.amount}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Tanggal Pembayaran</h3>
                  <p>{selectedPayment.paymentDate}</p>
                </div>
              </div>

              {selectedPayment.status === "rejected" && (
                <div>
                  <h3 className="text-sm font-medium">Alasan Penolakan</h3>
                  <p className="text-red-600">{selectedPayment.rejectionReason}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium mb-2">Bukti Pembayaran</h3>
                <div className="border rounded-md p-4 bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Preview bukti pembayaran
                    </p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <a href={selectedPayment.proofUrl} target="_blank" rel="noopener noreferrer">
                        Lihat Bukti Pembayaran
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {selectedPayment.status === "pending" && (
                <div className="flex justify-end space-x-4 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const reason = prompt("Masukkan alasan penolakan:");
                      if (reason) {
                        handleRejectPayment(selectedPayment.id, reason);
                      }
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Tolak Pembayaran
                  </Button>
                  <Button
                    onClick={() => handleVerifyPayment(selectedPayment.id)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Verifikasi Pembayaran
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Komponen tabel pembayaran
function PaymentsTable({
  payments,
  getStatusBadge,
  onViewPayment,
}: {
  payments: any[];
  getStatusBadge: (status: string) => React.ReactNode;
  onViewPayment: (payment: any) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Pembayaran</CardTitle>
        <CardDescription>
          {payments.length} pembayaran ditemukan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor Pesanan</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Tidak ada data pembayaran
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.orderNumber}</TableCell>
                    <TableCell>{payment.customerName}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>{payment.paymentDate}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
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
                          <DropdownMenuItem onClick={() => onViewPayment(payment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          {payment.status === "pending" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  onViewPayment(payment);
                                }}
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Verifikasi
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  onViewPayment(payment);
                                }}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Tolak
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}