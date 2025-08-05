import { NextRequest, NextResponse } from "next/server";
import { Form, FormResponse } from "@/lib/types";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data");
const formsPath = path.join(dataPath, "forms.json");
const responsesPath = path.join(dataPath, "responses.json");

function readForms(): Form[] {
  try {
    if (!fs.existsSync(formsPath)) {
      return [];
    }
    const data = fs.readFileSync(formsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao ler formulários:", error);
    return [];
  }
}

function saveForms(forms: Form[]): void {
  try {
    fs.writeFileSync(formsPath, JSON.stringify(forms, null, 2));
  } catch (error) {
    console.error("Erro ao salvar formulários:", error);
    throw error;
  }
}

function readResponses() {
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const forms = readForms();
    const form = forms.find((f) => f.id === id);

    if (!form) {
      return NextResponse.json(
        { error: "Formulário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao buscar formulário" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const forms = readForms();
    const responses = readResponses();

    const filteredForms = forms.filter((f) => f.id !== id);
    saveForms(filteredForms);

    const filteredResponses = responses.filter(
      (r: FormResponse) => r.formId !== id
    );
    saveResponses(filteredResponses);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao deletar formulário" },
      { status: 500 }
    );
  }
}
