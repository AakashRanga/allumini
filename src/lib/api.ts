import { getAuthSession } from "@/lib/session";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5555";

export type AcademicDetail = {
  degree: string;
  joining_year: string;
  college_name: string;
  branch?: string;
};

export type RegisterAlumniPayload = {
  name: string;
  email: string;
  phone: string;
  academic_details: AcademicDetail[];
  specialization: string;
  password?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; status: number };

async function request<T>(path: string, options: RequestInit): Promise<ApiResponse<T>> {
  let response: Response;
  const authSession = getAuthSession();

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(authSession ? {
          "X-Auth-User-Id": authSession.userId,
          "X-Auth-Role": authSession.role,
        } : {}),
        ...(options.headers ?? {}),
      },
      ...options,
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }

  const text = await response.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    return {
      success: false,
      error: data?.error || response.statusText || String(data) || "Unknown error",
      status: response.status,
    };
  }

  return { success: true, data };
}

export async function registerAlumni(payload: RegisterAlumniPayload) {
  const contactNumber = payload.phone.replace(/\D/g, "");

  return request<{ message: string; approved: boolean }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      contact_number: contactNumber,
      academic_details: payload.academic_details,
      specialization: payload.specialization,
      role: "alumni",
    }),
  });
}

export async function loginUser(payload: LoginPayload) {
  return request<{ message: string; role: string; approved: boolean; userId: string; email_verified?: boolean }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
    }),
  });
}

export async function verifyOtp(email: string, otp: string) {
  return request<{ message: string; email_verified: boolean }>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({
      email,
      otp,
    }),
  });
}

export async function resendOtp(email: string) {
  return request<{ message: string }>("/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });
}

export async function getUserStatus(email: string) {
  return request<{
    email_verified: boolean;
    is_approved: boolean;
    role: string;
  }>(`/auth/user-status?email=${encodeURIComponent(email)}`, {
    method: "GET",
  });
}

export type FirebaseLoginPayload = {
  idToken: string;
};

export async function loginWithFirebase(payload: FirebaseLoginPayload) {
  return request<{
    message: string;
    role: string;
    approved: boolean;
    userId: string;
    email_verified?: boolean;
  }>("/auth/firebase/login", {
    method: "POST",
    body: JSON.stringify({
      id_token: payload.idToken,
    }),
  });
}

export async function forgotPassword(email: string) {
  return request<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string) {
  return request<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}

export type FirebaseRegisterPayload = {
  idToken: string;
  name: string;
  phone: string;
  academic_details: AcademicDetail[];
  specialization: string;
};

export async function registerWithFirebase(payload: FirebaseRegisterPayload) {
  return request<{ message: string; approved: boolean }>("/auth/firebase/register", {
    method: "POST",
    body: JSON.stringify({
      id_token: payload.idToken,
      name: payload.name,
      phone: payload.phone,
      academic_details: payload.academic_details,
      specialization: payload.specialization,
    }),
  });
}
