"use client";

import { Question, Answer } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuestionRendererProps {
  question: Question;
  answer?: Answer;
  onAnswerChange: (answer: Answer) => void;
}

export function QuestionRenderer({
  question,
  answer,
  onAnswerChange,
}: QuestionRendererProps) {
  const handleValueChange = (value: string | string[] | number | boolean) => {
    onAnswerChange({
      questionId: question.id,
      value,
    });
  };

  const renderOptions = () => {
    if (!question.options || question.options.length === 0) return null;

    const optionsContainerClass =
      question.answerOrientation === "horizontal"
        ? "flex flex-wrap gap-4"
        : "space-y-3";

    if (question.questionType === "single_choice") {
      return (
        <RadioGroup
          value={(answer?.value as string) || ""}
          onValueChange={handleValueChange}
          className={optionsContainerClass}
        >
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.answer}
                id={`${question.id}-${option.id}`}
              />
              <Label htmlFor={`${question.id}-${option.id}`}>
                {option.answer}
              </Label>
              {option.openAnswer && (
                <Input
                  placeholder="Especifique..."
                  className="ml-2 w-48"
                  onChange={(e) =>
                    handleValueChange(`${option.answer}: ${e.target.value}`)
                  }
                />
              )}
            </div>
          ))}
        </RadioGroup>
      );
    }

    if (question.questionType === "multiple_choice") {
      return (
        <div className={optionsContainerClass}>
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${question.id}-${option.id}`}
                checked={((answer?.value as string[]) || []).includes(
                  option.answer
                )}
                onCheckedChange={(checked) => {
                  const currentValues = (answer?.value as string[]) || [];
                  if (checked) {
                    handleValueChange([...currentValues, option.answer]);
                  } else {
                    handleValueChange(
                      currentValues.filter((v) => v !== option.answer)
                    );
                  }
                }}
              />
              <Label htmlFor={`${question.id}-${option.id}`}>
                {option.answer}
              </Label>
              {option.openAnswer && (
                <Input
                  placeholder="Especifique..."
                  className="ml-2 w-48"
                  onChange={(e) =>
                    handleValueChange(`${option.answer}: ${e.target.value}`)
                  }
                />
              )}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4 p-6 border rounded-lg bg-card">
      <div>
        <Label className="text-base font-medium">
          {question.title}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {question.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {question.description}
          </p>
        )}
        {question.code && (
          <p className="text-xs text-muted-foreground mt-1">
            Código: {question.code}
          </p>
        )}
      </div>

      {question.questionType === "free_text" && (
        <Textarea
          value={(answer?.value as string) || ""}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder="Digite sua resposta..."
          className="min-h-[100px]"
        />
      )}

      {question.questionType === "integer" && (
        <Input
          type="number"
          value={(answer?.value as string) || ""}
          onChange={(e) => handleValueChange(parseInt(e.target.value) || 0)}
          placeholder="Digite um número inteiro..."
          step="1"
        />
      )}

      {question.questionType === "decimal_number" && (
        <Input
          type="number"
          value={(answer?.value as string) || ""}
          onChange={(e) => handleValueChange(parseFloat(e.target.value) || 0)}
          placeholder="Digite um número decimal..."
          step="0.01"
        />
      )}

      {question.questionType === "yes_no" && (
        <div className="flex gap-4">
          <Button
            variant={
              (answer?.value as boolean) === true ? "default" : "outline"
            }
            onClick={() => handleValueChange(true)}
            className="flex-1"
          >
            Yes
          </Button>
          <Button
            variant={
              (answer?.value as boolean) === false ? "default" : "outline"
            }
            onClick={() => handleValueChange(false)}
            className="flex-1"
          >
            No
          </Button>
        </div>
      )}

      {renderOptions()}
    </div>
  );
}
