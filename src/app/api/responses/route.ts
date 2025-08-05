import { NextRequest, NextResponse } from "next/server";
import { FormResponse } from "@/lib/types";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data");
const responsesPath = path.join(dataPath, "responses.json");

if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

function readResponses(): FormResponse[] {
  try {
    if (!fs.existsSync(responsesPath)) {
      return [];
    }
    const data = fs.readFileSync(responsesPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao ler respostas:", error);
    return [];
  }
}

function saveResponses(responses: FormResponse[]): void {
  try {
    fs.writeFileSync(responsesPath, JSON.stringify(responses, null, 2));
  } catch (error) {
    console.error("Erro ao salvar respostas:", error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get("formId");

    const responses = readResponses();

    if (formId) {
      const filteredResponses = responses.filter((r) => r.formId === formId);
      return NextResponse.json(filteredResponses);
    }

    return NextResponse.json(responses);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar respostas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const response: FormResponse = await request.json();
    const responses = readResponses();

    responses.push(response);
    saveResponses(responses);

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao salvar resposta" },
      { status: 500 }
    );
  }
}
