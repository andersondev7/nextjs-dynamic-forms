"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Form } from "@/lib/types";
import { apiStorage } from "@/lib/api-storage";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Eye, BarChart3, Trash2, Calendar } from "lucide-react";

function ResponseCount({ formId }: { formId: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const loadCount = async () => {
      const responses = await apiStorage.getFormResponses(formId);
      setCount(responses.length);
    };
    loadCount();
  }, [formId]);

  return <span>{count}</span>;
}

export default function HomePage() {
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    const loadForms = async () => {
      const forms = await apiStorage.getForms();
      setForms(forms);
    };
    loadForms();
  }, []);

  const handleDeleteForm = async (formId: string) => {
    if (
      confirm(
        "Tem certeza que deseja excluir este formulário? Esta ação não pode ser desfeita."
      )
    ) {
      await apiStorage.deleteForm(formId);
      const forms = await apiStorage.getForms();
      setForms(forms);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Formulários Dinâmicos
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Crie formulários inteligentes com condicionalidades e colete
              respostas facilmente
            </p>
            <Link href="/forms/new">
              <Button
                size="lg"
                className="gap-3 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-6 w-6" />
                Criar Novo Formulário
              </Button>
            </Link>
          </div>

          {forms.length === 0 ? (
            <Card className="max-w-md mx-auto text-center border-dashed border-2 border-muted-foreground/20">
              <CardContent className="pt-12 pb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Nenhum formulário criado
                </h3>
                <p className="text-muted-foreground mb-6 text-base">
                  Comece criando seu primeiro formulário dinâmico
                </p>
                <Link href="/forms/new">
                  <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Criar Formulário
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {forms.map((form) => (
                <Card
                  key={form.id}
                  variant="clickable"
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">
                          {form.title}
                        </CardTitle>
                        {form.description && (
                          <CardDescription className="line-clamp-2 text-base leading-relaxed">
                            {form.description}
                          </CardDescription>
                        )}
                      </div>
                      <Badge
                        variant={form.isActive ? "default" : "secondary"}
                        className="ml-4"
                      >
                        {form.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(form.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{form.questions.length} perguntas</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Respostas coletadas:
                        </span>
                        <Badge
                          variant="outline"
                          className="text-base px-3 py-1"
                        >
                          <ResponseCount formId={form.id} />
                        </Badge>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Link
                          href={`/forms/${form.id}/fill`}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 group-hover:border-primary group-hover:text-primary transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            Ver Formulário
                          </Button>
                        </Link>
                        <Link
                          href={`/forms/${form.id}/results`}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 group-hover:border-primary group-hover:text-primary transition-colors"
                          >
                            <BarChart3 className="h-4 w-4" />
                            Resultados
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteForm(form.id)}
                          className="text-destructive hover:text-destructive hover:border-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
