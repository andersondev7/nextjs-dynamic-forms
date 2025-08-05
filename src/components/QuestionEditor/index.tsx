"use client";

import { useState } from "react";
import { Question, AnswerOption } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, GripVertical } from "lucide-react";

interface QuestionEditorProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  availableQuestions: Question[];
  errors?: Record<string, string>;
}

export function QuestionEditor({
  question,
  onUpdate,
  onDelete,
  availableQuestions,
  errors = {},
}: QuestionEditorProps) {
  const [newOption, setNewOption] = useState("");

  const updateQuestion = (updates: Partial<Question>) => {
    onUpdate({ ...question, ...updates });
  };

  const handleFieldChange = (field: string, value: string) => {
    updateQuestion({ [field]: value });
  };

  const addOption = () => {
    if (newOption.trim()) {
      const newAnswerOption: AnswerOption = {
        id: crypto.randomUUID(),
        questionId: question.id,
        answer: newOption.trim(),
        order: (question.options?.length || 0) + 1,
        openAnswer: false,
      };

      const updatedOptions = [...(question.options || []), newAnswerOption];
      updateQuestion({ options: updatedOptions });
      setNewOption("");
    }
  };

  const removeOption = (optionId: string) => {
    const updatedOptions =
      question.options?.filter((opt) => opt.id !== optionId) || [];
    updateQuestion({ options: updatedOptions });
  };

  const updateOption = (optionId: string, updates: Partial<AnswerOption>) => {
    const updatedOptions =
      question.options?.map((opt) =>
        opt.id === optionId ? { ...opt, ...updates } : opt
      ) || [];
    updateQuestion({ options: updatedOptions });
  };

  const needsOptions = ["multiple_choice", "single_choice"].includes(
    question.questionType
  );

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
          <CardTitle className="text-lg">Pergunta</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Pergunta *</Label>
            <Input
              id="title"
              value={question.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="Digite sua pergunta..."
              className={
                errors.title
                  ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                  : ""
              }
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Identificador *</Label>
            <Input
              id="code"
              value={question.code}
              onChange={(e) => handleFieldChange("code", e.target.value)}
              placeholder="Ex: Q1, PERGUNTA_1..."
              className={
                errors.code
                  ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                  : ""
              }
              aria-invalid={!!errors.code}
            />
            {errors.code && (
              <p className="text-sm text-red-500 mt-1">{errors.code}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="questionType">Tipo de Resposta</Label>
            <Select
              value={question.questionType}
              onValueChange={(value) =>
                updateQuestion({
                  questionType: value as Question["questionType"],
                })
              }
            >
              <SelectTrigger
                className={
                  errors.questionType
                    ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                    : ""
                }
                aria-invalid={!!errors.questionType}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free_text">Texto livre</SelectItem>
                <SelectItem value="single_choice">Escolha única</SelectItem>
                <SelectItem value="multiple_choice">
                  Múltipla escolha
                </SelectItem>
                <SelectItem value="yes_no">Sim/Não</SelectItem>
                <SelectItem value="integer">Número inteiro</SelectItem>
                <SelectItem value="decimal_number">Número decimal</SelectItem>
              </SelectContent>
            </Select>
            {errors.questionType && (
              <p className="text-sm text-red-500 mt-1">{errors.questionType}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="answerOrientation">Layout das Opções</Label>
            <Select
              value={question.answerOrientation}
              onValueChange={(value) =>
                updateQuestion({
                  answerOrientation: value as "horizontal" | "vertical",
                })
              }
            >
              <SelectTrigger
                className={
                  errors.answerOrientation
                    ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                    : ""
                }
                aria-invalid={!!errors.answerOrientation}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="horizontal">Horizontal</SelectItem>
                <SelectItem value="vertical">Vertical</SelectItem>
              </SelectContent>
            </Select>
            {errors.answerOrientation && (
              <p className="text-sm text-red-500 mt-1">
                {errors.answerOrientation}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Ordem</Label>
            <Input
              id="order"
              type="number"
              value={question.order}
              onChange={(e) =>
                updateQuestion({ order: parseInt(e.target.value) })
              }
              min={1}
              className={
                errors.order
                  ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                  : ""
              }
              aria-invalid={!!errors.order}
            />
            {errors.order && (
              <p className="text-sm text-red-500 mt-1">{errors.order}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Instruções (opcional)</Label>
          <Textarea
            id="description"
            value={question.description || ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            placeholder="Adicione instruções ou contexto para a pergunta..."
            rows={2}
            className={
              errors.description
                ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                : ""
            }
            aria-invalid={!!errors.description}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            <Switch
              id="required"
              checked={question.required}
              onCheckedChange={(checked) =>
                updateQuestion({ required: checked })
              }
            />
            <Label htmlFor="required">Obrigatória</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="subQuestion"
              checked={question.subQuestion}
              onCheckedChange={(checked) =>
                updateQuestion({ subQuestion: checked })
              }
            />
            <Label htmlFor="subQuestion">Sub-pergunta</Label>
          </div>
        </div>

        {needsOptions && (
          <div className="space-y-2">
            <Label>Opções de resposta</Label>
            <div className="space-y-2">
              {question.options?.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    value={option.answer}
                    onChange={(e) =>
                      updateOption(option.id, { answer: e.target.value })
                    }
                    className="flex-1"
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={option.openAnswer}
                      onCheckedChange={(checked) =>
                        updateOption(option.id, { openAnswer: checked })
                      }
                    />
                    <Label className="text-xs">Resposta aberta</Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(option.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Nova opção..."
                  onKeyPress={(e) => e.key === "Enter" && addOption()}
                />
                <Button onClick={addOption}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {availableQuestions.length > 0 && (
          <div className="space-y-4 border-t pt-4">
            <Label>Condicionalidade (opcional)</Label>
            <div className="text-sm text-muted-foreground">
              Mostrar esta pergunta apenas quando uma condição for atendida
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Select
                value={question.conditional?.dependsOn || "none"}
                onValueChange={(value) => {
                  if (value && value !== "none") {
                    updateQuestion({
                      conditional: {
                        dependsOn: value,
                        operator: "equals",
                        value: "",
                      },
                    });
                  } else {
                    updateQuestion({ conditional: undefined });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Depende de..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma condição</SelectItem>
                  {availableQuestions.map((q) => (
                    <SelectItem key={q.id} value={q.id}>
                      {q.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {question.conditional && (
                <>
                  <Select
                    value={question.conditional.operator}
                    onValueChange={(value) =>
                      updateQuestion({
                        conditional: {
                          ...question.conditional!,
                          operator: value as
                            | "equals"
                            | "not-equals"
                            | "contains",
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">é igual a</SelectItem>
                      <SelectItem value="not-equals">é diferente de</SelectItem>
                      <SelectItem value="contains">contém</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    value={question.conditional.value}
                    onChange={(e) =>
                      updateQuestion({
                        conditional: {
                          ...question.conditional!,
                          value: e.target.value,
                        },
                      })
                    }
                    placeholder="Valor..."
                  />
                </>
              )}
            </div>

            {question.conditional && (
              <Badge variant="secondary" className="text-xs">
                Mostrar quando &quot;
                {
                  availableQuestions.find(
                    (q) => q.id === question.conditional?.dependsOn
                  )?.title
                }
                &quot;{" "}
                {question.conditional.operator === "equals"
                  ? "for igual a"
                  : question.conditional.operator === "not-equals"
                  ? "for diferente de"
                  : "contiver"}{" "}
                &quot;{question.conditional.value}&quot;
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
