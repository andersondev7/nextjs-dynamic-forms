"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Form, FormResponse } from "@/lib/types";
import { apiStorage } from "@/lib/api-storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, BarChart3, FileText } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function ResponsesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.id;

      const formData = await apiStorage.getForm(id);
      setForm(formData);

      if (formData) {
        const formResponses = await apiStorage.getFormResponses(id);
        setResponses(formResponses);
      }

      setIsLoading(false);
    };
    loadData();
  }, [params]);

  const formatAnswer = (
    questionId: string,
    value: string | string[] | number | boolean
  ) => {
    const question = form?.questions.find((q) => q.id === questionId);
    if (!question) return String(value);

    switch (question.questionType) {
      case "yes_no":
        return value ? "Sim" : "Não";
      case "multiple_choice":
        return Array.isArray(value) ? value.join(", ") : String(value);
      case "single_choice":
        return String(value);
      case "integer":
      case "decimal_number":
        return String(value);
      default:
        return String(value);
    }
  };

  const getQuestionStats = (questionId: string) => {
    const question = form?.questions.find((q) => q.id === questionId);
    if (!question) return null;

    const answers = responses
      .map((r) => r.answers.find((a) => a.questionId === questionId))
      .filter(Boolean);

    if (question.questionType === "single_choice") {
      const counts: Record<string, number> = {};
      answers.forEach((answer) => {
        const value = String(answer!.value);
        counts[value] = (counts[value] || 0) + 1;
      });
      return { type: "choices", data: counts };
    }

    if (question.questionType === "yes_no") {
      const yesCount = answers.filter((a) => a!.value === true).length;
      const noCount = answers.filter((a) => a!.value === false).length;
      return {
        type: "boolean",
        data: { Sim: yesCount, Não: noCount },
      };
    }

    if (
      question.questionType === "integer" ||
      question.questionType === "decimal_number"
    ) {
      const values = answers.map((a) => a!.value as number);
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      return {
        type: "scale",
        data: {
          average: avg.toFixed(1),
          min: Math.min(...values),
          max: Math.max(...values),
        },
      };
    }

    return { type: "text", data: answers.length };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando respostas...</p>
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
            <Link href="/">
              <Button>Voltar ao início</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Breadcrumb
              items={[
                { label: "Formulários", href: "/" },
                { label: "Resultados" },
              ]}
              className="mb-4"
            />
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Resultados do Formulário</h1>
                <p className="text-muted-foreground">{form.title}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total de Respostas
                    </p>
                    <p className="text-2xl font-bold">{responses.length}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Perguntas</p>
                    <p className="text-2xl font-bold">
                      {form.questions.length}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={form.isActive ? "default" : "secondary"}>
                      {form.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {responses.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhuma resposta ainda
                </h3>
                <p className="text-muted-foreground mb-4">
                  Quando alguém responder este formulário, os resultados
                  aparecerão aqui.
                </p>
                <Link href={`/forms/${form.id}/fill`}>
                  <Button>Ver Formulário</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Análise por Pergunta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {form.questions.map((question) => {
                      const stats = getQuestionStats(question.id);
                      if (!stats) return null;

                      return (
                        <div key={question.id}>
                          <h4 className="font-medium mb-2">{question.title}</h4>

                          {stats.type === "choices" && (
                            <div className="space-y-2">
                              {Object.entries(
                                stats.data as Record<string, number>
                              ).map(([value, count]) => (
                                <div
                                  key={value}
                                  className="flex items-center justify-between"
                                >
                                  <span className="text-sm">{value}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-32 bg-muted rounded-full h-2">
                                      <div
                                        className="bg-primary h-2 rounded-full"
                                        style={{
                                          width: `${
                                            (count / responses.length) * 100
                                          }%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-sm text-muted-foreground w-8">
                                      {count}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {stats.type === "boolean" && (
                            <div className="space-y-2">
                              {Object.entries(
                                stats.data as Record<string, number>
                              ).map(([value, count]) => (
                                <div
                                  key={value}
                                  className="flex items-center justify-between"
                                >
                                  <span className="text-sm">{value}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-32 bg-muted rounded-full h-2">
                                      <div
                                        className="bg-primary h-2 rounded-full"
                                        style={{
                                          width: `${
                                            (count / responses.length) * 100
                                          }%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-sm text-muted-foreground w-8">
                                      {count}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {stats.type === "scale" && (
                            <div className="flex gap-4 text-sm">
                              <span>
                                Média:{" "}
                                <strong>
                                  {
                                    (
                                      stats.data as {
                                        average: string;
                                        min: number;
                                        max: number;
                                      }
                                    ).average
                                  }
                                </strong>
                              </span>
                              <span>
                                Min:{" "}
                                <strong>
                                  {
                                    (
                                      stats.data as {
                                        average: string;
                                        min: number;
                                        max: number;
                                      }
                                    ).min
                                  }
                                </strong>
                              </span>
                              <span>
                                Max:{" "}
                                <strong>
                                  {
                                    (
                                      stats.data as {
                                        average: string;
                                        min: number;
                                        max: number;
                                      }
                                    ).max
                                  }
                                </strong>
                              </span>
                            </div>
                          )}

                          {stats.type === "text" && (
                            <p className="text-sm text-muted-foreground">
                              {String(stats.data)} respostas de texto
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Respostas Detalhadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {responses.map((response, index) => (
                      <div key={response.id}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Resposta #{index + 1}</h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(response.submittedAt).toLocaleString(
                              "pt-BR"
                            )}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {form.questions.map((question) => {
                            const answer = response.answers.find(
                              (a) => a.questionId === question.id
                            );
                            if (!answer) return null;

                            return (
                              <div key={question.id} className="text-sm">
                                <p className="font-medium text-muted-foreground">
                                  {question.title}
                                </p>
                                <p className="mt-1">
                                  {formatAnswer(question.id, answer.value)}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        {index < responses.length - 1 && (
                          <Separator className="mt-6" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
