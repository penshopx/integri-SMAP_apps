"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

// Schema validasi untuk form risiko
const riskFormSchema = z.object({
  title: z.string().min(5, {
    message: "Judul risiko harus minimal 5 karakter.",
  }),
  description: z.string().min(10, {
    message: "Deskripsi risiko harus minimal 10 karakter.",
  }),
  impact: z.enum(["low", "medium", "high"], {
    required_error: "Pilih tingkat dampak risiko.",
  }),
  likelihood: z.enum(["low", "medium", "high"], {
    required_error: "Pilih tingkat kemungkinan risiko.",
  }),
  status: z.enum(["identified", "mitigated", "accepted", "transferred"], {
    required_error: "Pilih status risiko.",
  }),
  mitigationPlan: z.string().optional(),
});

// Tipe data untuk form risiko
type RiskFormValues = z.infer<typeof riskFormSchema>;

// Props untuk komponen RiskForm
interface RiskFormProps {
  initialData?: RiskFormValues;
  onSubmit: (data: RiskFormValues) => Promise<void>;
  onCancel: () => void;
}

export function RiskForm({ initialData, onSubmit, onCancel }: RiskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default values untuk form
  const defaultValues: Partial<RiskFormValues> = {
    title: "",
    description: "",
    impact: "medium",
    likelihood: "medium",
    status: "identified",
    mitigationPlan: "",
    ...initialData,
  };

  // Inisialisasi form dengan react-hook-form
  const form = useForm<RiskFormValues>({
    resolver: zodResolver(riskFormSchema),
    defaultValues,
  });

  // Handler untuk submit form
  const handleSubmit = async (data: RiskFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting risk form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Risiko</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan judul risiko" {...field} />
              </FormControl>
              <FormDescription>
                Judul singkat yang menggambarkan risiko.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Risiko</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Jelaskan risiko secara detail"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Deskripsi detail tentang risiko dan potensi dampaknya.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="impact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dampak</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat dampak" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Rendah</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Tingkat dampak jika risiko terjadi.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="likelihood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kemungkinan</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat kemungkinan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Rendah</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Tingkat kemungkinan risiko terjadi.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status risiko" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="identified">Teridentifikasi</SelectItem>
                  <SelectItem value="mitigated">Dimitigasi</SelectItem>
                  <SelectItem value="accepted">Diterima</SelectItem>
                  <SelectItem value="transferred">Ditransfer</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Status penanganan risiko saat ini.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mitigationPlan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rencana Mitigasi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Jelaskan rencana mitigasi risiko"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Rencana untuk mengurangi atau menghilangkan risiko.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}