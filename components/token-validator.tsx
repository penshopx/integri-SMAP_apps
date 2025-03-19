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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

// Schema validasi untuk form token
const tokenFormSchema = z.object({
  token: z.string().min(6, {
    message: "Token harus minimal 6 karakter.",
  }),
});

export function TokenValidator() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  // Inisialisasi form dengan react-hook-form
  const form = useForm<z.infer<typeof tokenFormSchema>>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: {
      token: "",
    },
  });

  // Handler untuk submit form
  const onSubmit = async (values: z.infer<typeof tokenFormSchema>) => {
    setIsValidating(true);
    setValidationResult(null);

    try {
      // Simulasi validasi token
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulasi hasil validasi (dalam implementasi nyata, ini akan memanggil API)
      const isValid = values.token === "VALID123";
      setValidationResult({
        isValid,
        message: isValid
          ? "Token valid. Dokumen ini asli dan dikeluarkan oleh sistem kami."
          : "Token tidak valid. Dokumen ini mungkin palsu atau telah dimodifikasi.",
      });
    } catch (error) {
      setValidationResult({
        isValid: false,
        message: "Terjadi kesalahan saat memvalidasi token. Silakan coba lagi.",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Validasi Token Dokumen</CardTitle>
        <CardDescription>
          Masukkan token dokumen untuk memverifikasi keasliannya
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Dokumen</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan token dokumen" {...field} />
                  </FormControl>
                  <FormDescription>
                    Token dapat ditemukan di bagian bawah dokumen SMAP.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isValidating} className="w-full">
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memvalidasi...
                </>
              ) : (
                "Validasi Token"
              )}
            </Button>
          </form>
        </Form>

        {validationResult && (
          <Alert
            className={`mt-4 ${
              validationResult.isValid ? "bg-green-50" : "bg-red-50"
            }`}
          >
            {validationResult.isValid ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertTitle>
              {validationResult.isValid ? "Token Valid" : "Token Tidak Valid"}
            </AlertTitle>
            <AlertDescription>{validationResult.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Validasi token membantu memastikan keaslian dokumen SMAP.
        </p>
      </CardFooter>
    </Card>
  );
}