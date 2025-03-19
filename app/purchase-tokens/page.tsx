"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Building, ArrowRight } from 'lucide-react';

export default function PurchaseTokensPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "basic",
      name: "Paket Dasar",
      price: "Rp 1.500.000",
      description: "Cocok untuk organisasi kecil yang baru memulai implementasi SMAP",
      tokens: 50,
      features: [
        "50 token dokumen",
        "Akses ke template dasar",
        "Dukungan email",
        "Berlaku selama 6 bulan",
      ],
    },
    {
      id: "standard",
      name: "Paket Standar",
      price: "Rp 3.000.000",
      description: "Ideal untuk organisasi menengah dengan kebutuhan SMAP yang lebih kompleks",
      tokens: 120,
      features: [
        "120 token dokumen",
        "Akses ke semua template",
        "Dukungan prioritas",
        "Konsultasi online (2 jam)",
        "Berlaku selama 12 bulan",
      ],
      popular: true,
    },
    {
      id: "premium",
      name: "Paket Premium",
      price: "Rp 5.000.000",
      description: "Solusi lengkap untuk organisasi besar dengan kebutuhan SMAP yang komprehensif",
      tokens: 250,
      features: [
        "250 token dokumen",
        "Akses ke semua template premium",
        "Dukungan prioritas 24/7",
        "Konsultasi online (5 jam)",
        "Workshop implementasi SMAP",
        "Berlaku selama 12 bulan",
      ],
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleProceedToPayment = () => {
    if (selectedPlan) {
      // Redirect ke halaman pembayaran
      window.location.href = `/payment?plan=${selectedPlan}`;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Beli Token</h1>
        <p className="text-muted-foreground">
          Pilih paket token yang sesuai dengan kebutuhan organisasi Anda
        </p>
      </div>

      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="packages">Paket Token</TabsTrigger>
          <TabsTrigger value="custom">Permintaan Khusus</TabsTrigger>
        </TabsList>
        <TabsContent value="packages" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative overflow-hidden ${
                  selectedPlan === plan.id
                    ? "border-primary ring-2 ring-primary ring-offset-2"
                    : ""
                } ${plan.popular ? "shadow-lg" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute right-0 top-0">
                    <div className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                      Populer
                    </div>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-3xl font-bold">{plan.price}</span>
                  </div>
                  <Badge variant="outline" className="px-3 py-1">
                    {plan.tokens} Token
                  </Badge>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={selectedPlan === plan.id ? "default" : "outline"}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? "Paket Dipilih" : "Pilih Paket"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {selectedPlan && (
            <div className="mt-8 flex justify-center">
              <Button size="lg" onClick={handleProceedToPayment}>
                Lanjutkan ke Pembayaran
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="custom" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Permintaan Paket Khusus</CardTitle>
              <CardDescription>
                Butuh paket token yang disesuaikan dengan kebutuhan spesifik organisasi Anda?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Paket Korporat</h3>
                      <p className="text-sm text-muted-foreground">
                        Untuk perusahaan besar dengan kebutuhan token dalam jumlah banyak dan fitur khusus.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Paket Institusi</h3>
                      <p className="text-sm text-muted-foreground">
                        Untuk institusi pendidikan, pemerintah, atau organisasi non-profit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-4 mt-4">
                <h3 className="font-medium mb-2">Keuntungan Paket Khusus:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span className="text-sm">Jumlah token yang disesuaikan dengan kebutuhan</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span className="text-sm">Harga khusus untuk pembelian dalam jumlah besar</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span className="text-sm">Dukungan implementasi SMAP yang dipersonalisasi</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span className="text-sm">Pelatihan khusus untuk tim Anda</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <a href="/contact">Hubungi Kami untuk Penawaran Khusus</a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}