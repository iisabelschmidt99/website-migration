import type { AssignableRole } from "@/lib/admin/accessControlModel";

export type UserCreationPasswordMode = "manual" | "generated";
export type UserCreationMode = "invite" | "create";

export type UserCreationFormState = {
  email: string;
  role: AssignableRole;
  creationMode: UserCreationMode;
  passwordMode: UserCreationPasswordMode;
  password: string;
  sendEmail: boolean;
  emailConfirmed: boolean;
};

export type CreateStaffUserPayload = {
  mode: UserCreationMode;
  email: string;
  role: AssignableRole;
  password?: string;
  generatePassword?: boolean;
  sendEmail?: boolean;
  emailConfirmed?: boolean;
};

export function getInitialUserCreationState(): UserCreationFormState {
  return {
    email: "",
    role: "editor",
    creationMode: "invite",
    passwordMode: "generated",
    password: "",
    sendEmail: false,
    emailConfirmed: true,
  };
}

export function validateUserCreationForm(state: UserCreationFormState): string | null {
  if (!state.email.trim()) {
    return "Bitte E-Mail-Adresse eingeben.";
  }
  if (state.creationMode === "create" && state.passwordMode === "manual" && !state.password.trim()) {
    return "Bitte Passwort eingeben.";
  }
  return null;
}

export function buildStaffUserPayload(state: UserCreationFormState): CreateStaffUserPayload {
  if (state.creationMode === "invite") {
    return {
      mode: "invite",
      email: state.email.trim().toLowerCase(),
      role: state.role,
    };
  }

  return {
    mode: "create",
    email: state.email.trim().toLowerCase(),
    role: state.role,
    generatePassword: state.passwordMode === "generated",
    sendEmail: state.sendEmail,
    emailConfirmed: state.emailConfirmed,
    ...(state.passwordMode === "manual" ? { password: state.password } : {}),
  };
}
