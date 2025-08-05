import { Form, Question, FormResponse } from "./types";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export function validateForm(form: Form): ValidationResult {
  const errors: ValidationError[] = [];

  if (!form.title?.trim()) {
    errors.push({
      field: "title",
      message: "O título do formulário é obrigatório",
    });
  }

  if (form.title?.trim() && form.title.trim().length < 3) {
    errors.push({
      field: "title",
      message: "O título deve ter pelo menos 3 caracteres",
    });
  }

  if (form.title?.trim() && form.title.trim().length > 100) {
    errors.push({
      field: "title",
      message: "O título deve ter no máximo 100 caracteres",
    });
  }

  if (form.description && form.description.length > 500) {
    errors.push({
      field: "description",
      message: "A descrição deve ter no máximo 500 caracteres",
    });
  }

  if (!form.questions || form.questions.length === 0) {
    errors.push({
      field: "questions",
      message: "O formulário deve ter pelo menos uma pergunta",
    });
  }

  if (form.questions) {
    form.questions.forEach((question, index) => {
      const questionErrors = validateQuestion(question, form.questions);
      questionErrors.forEach((error) => {
        errors.push({
          field: `questions[${index}].${error.field}`,
          message: error.message,
        });
      });
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateQuestion(
  question: Question,
  allQuestions: Question[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!question.title?.trim()) {
    errors.push({
      field: "title",
      message: "O título da pergunta é obrigatório",
    });
  }

  if (question.title?.trim() && question.title.trim().length < 3) {
    errors.push({
      field: "title",
      message: "O título da pergunta deve ter pelo menos 3 caracteres",
    });
  }

  if (question.title?.trim() && question.title.trim().length > 200) {
    errors.push({
      field: "title",
      message: "O título da pergunta deve ter no máximo 200 caracteres",
    });
  }

  if (!question.code?.trim()) {
    errors.push({
      field: "code",
      message: "O código da pergunta é obrigatório",
    });
  }

  if (question.code && !/^[a-zA-Z0-9_-]+$/.test(question.code)) {
    errors.push({
      field: "code",
      message:
        "O código deve conter apenas letras, números, underscore (_) e hífen (-)",
    });
  }

  const duplicateCode = allQuestions.find(
    (q) => q.id !== question.id && q.code === question.code
  );
  if (duplicateCode) {
    errors.push({
      field: "code",
      message: "Código duplicado. Use um código único para cada pergunta",
    });
  }

  if (question.order < 1) {
    errors.push({
      field: "order",
      message: "A ordem deve ser maior que zero",
    });
  }

  if (question.description && question.description.length > 300) {
    errors.push({
      field: "description",
      message: "A descrição deve ter no máximo 300 caracteres",
    });
  }

  if (["single_choice", "multiple_choice"].includes(question.questionType)) {
    if (!question.options || question.options.length === 0) {
      errors.push({
        field: "options",
        message: "Perguntas de escolha devem ter pelo menos uma opção",
      });
    } else if (question.options.length < 2) {
      errors.push({
        field: "options",
        message: "Perguntas de escolha devem ter pelo menos duas opções",
      });
    } else {
      question.options.forEach((option, index) => {
        if (!option.answer?.trim()) {
          errors.push({
            field: `options[${index}].answer`,
            message: "A resposta da opção não pode estar vazia",
          });
        }
      });
    }
  }

  if (question.conditional) {
    if (!question.conditional.dependsOn) {
      errors.push({
        field: "conditional.dependsOn",
        message: "Selecione uma pergunta para a condicionalidade",
      });
    }

    if (!question.conditional.value?.trim()) {
      errors.push({
        field: "conditional.value",
        message: "O valor da condicionalidade é obrigatório",
      });
    }
  }

  return errors;
}

export function validateResponse(
  response: FormResponse,
  form: Form
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!form) {
    errors.push({
      field: "formId",
      message: "Formulário não encontrado",
    });
    return { isValid: false, errors };
  }

  const requiredQuestions = form.questions.filter((q) => q.required);

  for (const question of requiredQuestions) {
    const answer = response.answers.find((a) => a.questionId === question.id);

    if (!answer) {
      errors.push({
        field: `question_${question.code}`,
        message: `A pergunta "${question.title}" é obrigatória`,
      });
      continue;
    }

    const valueError = validateAnswerValue(answer.value, question);
    if (valueError) {
      errors.push({
        field: `question_${question.code}`,
        message: valueError,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function validateAnswerValue(
  value: string | string[] | number | boolean,
  question: Question
): string | null {
  if (value === null || value === undefined || value === "") {
    return "Esta pergunta é obrigatória";
  }

  switch (question.questionType) {
    case "free_text":
      if (typeof value !== "string") {
        return "Valor deve ser um texto";
      }
      if (value.trim().length < 1) {
        return "A resposta não pode estar vazia";
      }
      if (value.length > 1000) {
        return "A resposta deve ter no máximo 1000 caracteres";
      }
      break;

    case "integer":
      if (isNaN(Number(value)) || !Number.isInteger(Number(value))) {
        return "Valor deve ser um número inteiro";
      }
      break;

    case "decimal_number":
      if (isNaN(Number(value))) {
        return "Valor deve ser um número";
      }
      break;

    case "yes_no":
      if (typeof value !== "boolean") {
        return "Valor deve ser Sim ou Não";
      }
      break;

    case "single_choice":
      if (typeof value !== "string") {
        return "Selecione uma opção";
      }
      if (!question.options?.some((opt) => opt.answer === value)) {
        return "Opção selecionada não é válida";
      }
      break;

    case "multiple_choice":
      if (!Array.isArray(value)) {
        return "Selecione pelo menos uma opção";
      }
      if (value.length === 0) {
        return "Selecione pelo menos uma opção";
      }
      for (const selectedValue of value) {
        if (!question.options?.some((opt) => opt.answer === selectedValue)) {
          return "Uma das opções selecionadas não é válida";
        }
      }
      break;
  }

  return null;
}

export function getFieldError(
  field: string,
  errors: ValidationError[]
): string | null {
  const error = errors.find((e) => e.field === field);
  return error?.message || null;
}

export function validateField(
  field: string,
  value: string,
  form?: Form
): string | null {
  switch (field) {
    case "title":
      if (!value?.trim()) return "O título é obrigatório";
      if (value.trim().length < 3) return "Mínimo 3 caracteres";
      if (value.trim().length > 100) return "Máximo 100 caracteres";
      break;

    case "code":
      if (!value?.trim()) return "O código é obrigatório";
      if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
        return "Apenas letras, números, _ e -";
      }
      break;

    case "description":
      if (value && value.length > 500) return "Máximo 500 caracteres";
      break;
  }

  return null;
}
