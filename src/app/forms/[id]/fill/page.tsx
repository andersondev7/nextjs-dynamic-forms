"use client";

import { useEffect, useState } from "react";
import { Form, FormResponse, Answer } from "@/lib/types";
import { apiStorage } from "@/lib/api-storage";
import { validateResponse } from "@/lib/validations";
import { QuestionRenderer } from "@/components/QuestionRenderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Send, CheckCircle, FileText } from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function FormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadForm = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.id;

      const formData = await apiStorage.getForm(id);
      setForm(formData);
      setIsLoading(false);
    };
    loadForm();
  }, [params]);

  const shouldShowQuestion = (questionId: string): boolean => {
    const question = form?.questions.find((q) => q.id === questionId);
    if (!question?.conditional) return true;

    const dependentAnswer = answers.find(
      (a) => a.questionId === question.conditional!.dependsOn
    );
    if (!dependentAnswer) return false;

    const { operator, value } = question.conditional;
    const answerValue = String(dependentAnswer.value);

    switch (operator) {
      case "equals":
        return answerValue === value;
      case "not-equals":
        return answerValue !== value;
      case "contains":
        return answerValue.toLowerCase().includes(value.toLowerCase());
      default:
        return false;
    }
  };

  const handleAnswerChange = (answer: Answer) => {
    setAnswers((prev) => {
      const existing = prev.findIndex(
        (a) => a.questionId === answer.questionId
      );
      if (existing >= 0) {
        const newAnswers = [...prev];
        newAnswers[existing] = answer;
        return newAnswers;
      }
      return [...prev, answer];
    });
  };

  const validateAnswers = () => {
    if (!form) return false;

    const response: FormResponse = {
      id: "",
      formId: form.id,
      answers,
      submittedAt: new Date(),
    };

    const validation = validateResponse(response, form);
    return validation.isValid;
  };

  const getValidationErrors = () => {
    if (!form) return [];

    const response: FormResponse = {
      id: "",
      formId: form.id,
      answers,
      submittedAt: new Date(),
    };

    const validation = validateResponse(response, form);
    return validation.errors;
  };

  const submitForm = async () => {
    if (!form) {
      alert("Formulário não encontrado");
      return;
    }

    if (!validateAnswers()) {
      const errors = getValidationErrors();
      const firstError = errors[0];
      if (firstError) {
        alert(`Erro: ${firstError.message}`);
      } else {
        alert("Por favor, responda todas as perguntas obrigatórias");
      }
      return;
    }

    const response: FormResponse = {
      id: Date.now().toString(),
      formId: form.id,
      answers,
      submittedAt: new Date(),
    };

    try {
      await apiStorage.saveResponse(response);
    } catch (error) {
      console.error("Erro ao salvar resposta:", error);
      alert("Erro ao enviar formulário. Tente novamente.");
      return;
    }

    setSubmitted(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando formulário...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">
              Formulário não encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              O formulário que você está procurando não existe ou foi removido.
            </p>
            <Link href="/">
              <Button>Voltar ao início</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Formulário enviado com sucesso!
            </h3>
            <p className="text-muted-foreground mb-4">
              Obrigado por participar. Suas respostas foram registradas.
            </p>
            <Link href="/">
              <Button>Voltar ao início</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const visibleQuestions = form.questions.filter((q) =>
    shouldShowQuestion(q.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Breadcrumb
              items={[
                { label: "Formulários", href: "/" },
                { label: "Responder Formulário" },
              ]}
              className="mb-4"
            />
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
            </div>
          </div>

          <Card className="mb-8 shadow-lg border-0">
            <CardHeader className="pb-6">
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-3">{form.title}</CardTitle>
                  {form.description && (
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {form.description}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="mb-6 shadow-sm border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="pt-6">
              <Progress
                value={answers.length}
                max={visibleQuestions.length}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {answers.length} de {visibleQuestions.length} perguntas
                  respondidas
                </span>
                <span>
                  {Math.round((answers.length / visibleQuestions.length) * 100)}
                  % completo
                </span>
              </div>
            </CardContent>
          </Card>

          {(() => {
            const errors = getValidationErrors();
            return errors.length > 0 ? (
              <Card className="mb-6 border-red-200 bg-red-50 shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Campos Obrigatórios
                  </h3>
                  <ul className="space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-700">
                        • {error.message}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null;
          })()}

          <div className="space-y-8 mb-8">
            {visibleQuestions.map((question) => (
              <QuestionRenderer
                key={question.id}
                question={question}
                answer={answers.find((a) => a.questionId === question.id)}
                onAnswerChange={handleAnswerChange}
              />
            ))}
          </div>

          {visibleQuestions.length > 0 && (
            <div className="text-center pt-8 border-t">
              <Button
                onClick={submitForm}
                size="lg"
                className="gap-3 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={!validateAnswers()}
              >
                <Send className="h-6 w-6" />
                Enviar Respostas
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
