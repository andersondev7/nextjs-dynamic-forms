export interface AnswerOption {
  id: string;
  questionId: string;
  answer: string;
  order: number;
  openAnswer: boolean;
}

export interface Question {
  id: string;
  formId: string;
  title: string;
  code: string;
  description?: string;
  answerOrientation: "horizontal" | "vertical";
  order: number;
  required: boolean;
  subQuestion: boolean;
  questionType:
    | "yes_no"
    | "multiple_choice"
    | "single_choice"
    | "free_text"
    | "integer"
    | "decimal_number";
  options?: AnswerOption[];
  conditional?: {
    dependsOn: string;
    operator: "equals" | "not-equals" | "contains";
    value: string;
  };
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  order: number;
  questions: Question[];
  createdAt: Date;
  isActive: boolean;
}

export interface Answer {
  questionId: string;
  value: string | string[] | number | boolean;
}

export interface FormResponse {
  id: string;
  formId: string;
  answers: Answer[];
  submittedAt: Date;
}
