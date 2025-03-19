"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function AIChat() {
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant for a compliance management system.",
            },
            {
              role: "user",
              content: input,
            },
          ],
        }),
      })

      const data = await res.json()
      if (data.error) {
        throw new Error(data.error)
      }

      setResponse(data.response || "No response received")
    } catch (error) {
      console.error("Error:", error)
      setResponse("Error: Failed to get response from AI")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="Ask a question about compliance..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button type="submit" disabled={loading || !input.trim()}>
            {loading ? "Processing..." : "Submit"}
          </Button>
        </form>

        {response && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Response:</h3>
            <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">{response}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

