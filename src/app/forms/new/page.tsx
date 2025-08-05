"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Question } from "@/lib/types";
import { apiStorage } from "@/lib/api-storage";
import { validateForm, validateField } from "@/lib/validations";
import { QuestionEditor } from "@/components/QuestionEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Plus, Save, Eye, FileText, Settings } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function CreateFormPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [questionErrors, setQuestionErrors] = useState<
    Record<string, Record<string, string>>
  >({});

  const validateFieldRealTime = (field: string, value: string) => {
    const error = validateField(field, value);
    setFieldErrors((prev) => ({
      ...prev,
      [field]: error || "",
    }));
  };

  const validateQuestionFieldRealTime = (
    questionId: string,
    field: string,
    value: string
  ) => {
    const error = validateField(field, value);
    setQuestionErrors((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: error || "",
      },
    }));
  };

  const createNewQuestion = (): Question => ({
    id: crypto.randomUUID(),
    formId: "",
    title: "",
    code: `Q${questions.length + 1}`,
    description: "",
    answerOrientation: "vertical",
    order: questions.length + 1,
    required: false,
    subQuestion: false,
    questionType: "free_text",
  });

  const addQuestion = () => {
    setQuestions([...questions, createNewQuestion()]);
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);

    validateQuestionFieldRealTime(
      updatedQuestion.id,
      "title",
      updatedQuestion.title
    );
    validateQuestionFieldRealTime(
      updatedQuestion.id,
      "code",
      updatedQuestion.code
    );
    if (updatedQuestion.description) {
      validateQuestionFieldRealTime(
        updatedQuestion.id,
        "description",
        updatedQuestion.description
      );
    }
  };

  const deleteQuestion = (index: number) => {
    const questionToDelete = questions[index];
    setQuestions(questions.filter((_, i) => i !== index));

    setQuestionErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[questionToDelete.id];
      return newErrors;
    });
  };

  const saveForm = async () => {
    setFieldErrors({});
    setQuestionErrors({});

    const form: Form = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      order: 1,
      questions: questions.map((q, index) => ({
        ...q,
        formId: "",
        order: index + 1,
      })),
      createdAt: new Date(),
      isActive,
    };

    const validation = validateForm(form);
    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        if (error.field === "title") {
          setFieldErrors((prev) => ({ ...prev, title: error.message }));
        } else if (error.field === "description") {
          setFieldErrors((prev) => ({ ...prev, description: error.message }));
        } else if (error.field.startsWith("questions[")) {
          const match = error.field.match(/questions\[(\d+)\]\.(.+)/);
          if (match) {
            const questionIndex = parseInt(match[1]);
            const fieldName = match[2];
            const question = questions[questionIndex];
            if (question) {
              setQuestionErrors((prev) => ({
                ...prev,
                [question.id]: {
                  ...prev[question.id],
                  [fieldName]: error.message,
                },
              }));
            }
          }
        }
      });

      const firstError = validation.errors[0];
      if (firstError && !firstError.field.startsWith("perguntas[")) {
        alert(`Erro: ${firstError.message}`);
      }
      return;
    }

    try {
      await apiStorage.saveForm(form);
      router.push("/");
    } catch (error) {
      console.error("Erro ao salvar formulário:", error);
      alert("Erro ao salvar formulário. Tente novamente.");
    }
  };

  const previewForm = () => {
    if (!title.trim() || questions.length === 0) {
      alert("Salve o formulário primeiro para visualizá-lo");
      return;
    }

    const tempForm: Form = {
      id: "preview",
      title: title.trim(),
      description: description.trim() || undefined,
      order: 1,
      questions: questions.map((q, index) => ({
        ...q,
        idFormulario: "",
        order: index + 1,
      })),
      createdAt: new Date(),
      isActive,
    };

    sessionStorage.setItem("preview-form", JSON.stringify(tempForm));
    window.open("/forms/preview/fill", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Breadcrumb
              items={[
                { label: "Formulários", href: "/" },
                { label: "Criar Formulário" },
              ]}
              className="mb-4"
            />
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Criar Formulário</h1>
                <p className="text-muted-foreground">
                  Configure seu novo formulário dinâmico
                </p>
              </div>
            </div>
          </div>

          <Card className="mb-8 shadow-lg border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  Informações do Formulário
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nome do Formulário *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    validateFieldRealTime("title", e.target.value);
                  }}
                  placeholder="Ex: Pesquisa de Satisfação, Avaliação de Produto..."
                  className={
                    fieldErrors.title
                      ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                      : ""
                  }
                  aria-invalid={!!fieldErrors.title}
                />
                {fieldErrors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {fieldErrors.title}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    validateFieldRealTime("description", e.target.value);
                  }}
                  placeholder="Explique o objetivo deste formulário..."
                  rows={3}
                  className={
                    fieldErrors.description
                      ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                      : ""
                  }
                  aria-invalid={!!fieldErrors.description}
                />
                {fieldErrors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {fieldErrors.description}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="active">Formulário ativo para respostas</Label>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Perguntas</h2>
                  <p className="text-muted-foreground">
                    Adicione as perguntas do seu formulário
                  </p>
                </div>
              </div>
              <Button onClick={addQuestion} className="gap-2 shadow-lg">
                <Plus className="h-4 w-4" />
                Adicionar Pergunta
              </Button>
            </div>

            {questions.length === 0 ? (
              <Card className="border-dashed border-2 border-muted-foreground/20">
                <CardContent className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Nenhuma pergunta adicionada
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Clique em &quot;Adicionar Pergunta&quot; para começar a
                    configurar seu formulário.
                  </p>
                  <Button
                    onClick={addQuestion}
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Primeira Pergunta
                  </Button>
                </CardContent>
              </Card>
            ) : (
              questions.map((question, index) => (
                <QuestionEditor
                  key={question.id}
                  question={question}
                  onUpdate={(updatedQuestion) =>
                    updateQuestion(index, updatedQuestion)
                  }
                  onDelete={() => deleteQuestion(index)}
                  availableQuestions={questions.slice(0, index)}
                  errors={questionErrors[question.id] || {}}
                />
              ))
            )}
          </div>

          <div className="flex gap-4 justify-end pt-6 border-t">
            <Button
              variant="outline"
              onClick={previewForm}
              className="gap-2 px-6"
            >
              <Eye className="h-4 w-4" />
              Visualizar Formulário
            </Button>
            <Button onClick={saveForm} className="gap-2 px-6 shadow-lg">
              <Save className="h-4 w-4" />
              Criar Formulário
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
