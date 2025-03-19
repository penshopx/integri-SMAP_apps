import { type NextRequest, NextResponse } from "next/server"
import { getChatCompletion } from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages are required and must be an array" }, { status: 400 })
    }

    const response = await getChatCompletion(messages, {
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 500,
    })

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in AI route:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

