import { NextRequest, NextResponse } from "next/server";
import { Form } from "@/lib/types";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data");
const formsPath = path.join(dataPath, "forms.json");

if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

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

export async function GET() {
  try {
    const forms = readForms();
    return NextResponse.json(forms);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar formulários" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const form: Form = await request.json();
    const forms = readForms();

    const existingIndex = forms.findIndex((f) => f.id === form.id);

    if (existingIndex >= 0) {
      forms[existingIndex] = form;
    } else {
      forms.push(form);
    }

    saveForms(forms);

    return NextResponse.json(form);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao salvar formulário" },
      { status: 500 }
    );
  }
}
