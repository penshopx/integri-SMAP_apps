// components/analytics/compliance-chart.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function ComplianceChart() {
  const [data, setData] = useState({
    clauseData: [],
    statusData: [],
    trendData: []
  });
  
  useEffect(() => {
    // In a real app, fetch from API
    setData({
      clauseData: [
        { name: '4. Konteks Organisasi', score: 85 },
        { name: '5. Kepemimpinan', score: 90 },
        { name: '6. Perencanaan', score: 75 },
        { name: '7. Dukungan', score: 80 },
        { name: '8. Operasi', score: 65 },
        { name: '9. Evaluasi Kinerja', score: 70 },
        { name: '10. Peningkatan', score: 80 },
      ],
      statusData: [
        { name: 'Sesuai', value: 65 },
        { name: 'Ketidaksesuaian Minor', value: 20 },
        { name: 'Ketidaksesuaian Mayor', value: 10 },
        { name: 'Observasi', value: 5 },
      ],
      trendData: [
        { name: 'Jan', score: 65 },
        { name: 'Feb', score: 68 },
        { name: 'Mar', score: 70 },
        { name: 'Apr', score: 72 },
        { name: 'Mei', score: 75 },
        { name: 'Jun', score: 78 },
      ]
    });
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analisis Kepatuhan</CardTitle>
        <CardDescription>Analisis kepatuhan terhadap ISO 37001:2016</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="clause">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="clause">Per Klausul</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="trend">Tren</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clause">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.clauseData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Skor']} />
                  <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="status">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => [`${value}%`, 'Persentase']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="trend">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Skor']} />
                  <Bar dataKey="score" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}