import { Form, FormResponse } from "./types";

export const apiStorage = {
  async getForms(): Promise<Form[]> {
    try {
      const response = await fetch("/api/forms");
      if (!response.ok) {
        throw new Error("Error fetching forms");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching forms:", error);
      return [];
    }
  },

  async getForm(id: string): Promise<Form | null> {
    try {
      const response = await fetch(`/api/forms/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Error fetching form");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching form:", error);
      return null;
    }
  },

  async saveForm(form: Form): Promise<void> {
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Error saving form");
      }
    } catch (error) {
      console.error("Error saving form:", error);
      throw error;
    }
  },

  async deleteForm(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/forms/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error deleting form");
      }
    } catch (error) {
      console.error("Error deleting form:", error);
      throw error;
    }
  },

  async getResponses(): Promise<FormResponse[]> {
    try {
      const response = await fetch("/api/responses");
      if (!response.ok) {
        throw new Error("Error fetching responses");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching responses:", error);
      return [];
    }
  },

  async getFormResponses(formId: string): Promise<FormResponse[]> {
    try {
      const response = await fetch(`/api/responses?formId=${formId}`);
      if (!response.ok) {
        throw new Error("Error fetching form responses");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching form responses:", error);
      return [];
    }
  },

  async saveResponse(response: FormResponse): Promise<void> {
    try {
      const apiResponse = await fetch("/api/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
      });

      if (!apiResponse.ok) {
        throw new Error("Error saving response");
      }
    } catch (error) {
      console.error("Error saving response:", error);
      throw error;
    }
  },
};
