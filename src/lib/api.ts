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

export async function apiCall(path: string, method: string = "GET", body?: any) {
  const options: RequestInit = { method };
  if (body) {
    options.body = JSON.stringify(body);
  }
  return request<any>(path, options);
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

export type ProfileExperienceEntry = {
  company: string;
  role: string;
  duration: string;
  description?: string;
};

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  contact_number: string | null;
  academic_details: AcademicDetail[];
  specialization: string | null;
  awards: string[];
  honorary_degrees: string[];
  books_authored: string[];
  other_accolades: string[];
  previous_experience: ProfileExperienceEntry[];
  profile_image: string | null;
};

export async function getUserProfile() {
  return request<UserProfile>("/auth/profile", { method: "GET" });
}

export async function updateUserProfile(payload: Partial<Omit<UserProfile, "id" | "email">>) {
  return request<{ message: string }>("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
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

export type JobPost = {
  id: number;
  user_id: number;
  poster_name: string;
  company: string;
  role: string;
  location: string;
  job_type: string;
  salary: string;
  description: string;
  requirements: string;
  apply_link: string;
  is_blocked: number;
  created_at: string;
};

export type AchievementPost = {
  id: number;
  user_id: number;
  poster_name: string;
  title: string;
  description: string;
  image_url: string | null;
  is_blocked: number;
  created_at: string;
};

export async function getJobs() {
  return request<JobPost[]>("/posts/jobs", { method: "GET" });
}

export async function getAchievements() {
  return request<AchievementPost[]>("/posts/achievements", { method: "GET" });
}

export async function getMyJobs() {
  return request<JobPost[]>("/posts/my-jobs", { method: "GET" });
}

export async function getMyAchievements() {
  return request<AchievementPost[]>("/posts/my-achievements", { method: "GET" });
}

export type UpdateJobPayload = {
  company?: string;
  role?: string;
  location?: string;
  job_type?: string;
  salary?: string;
  description?: string;
  requirements?: string;
  apply_link?: string;
};

export async function updateJob(jobId: number, payload: UpdateJobPayload) {
  return request<{ message: string }>(`/posts/job/${jobId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export type UpdateAchievementPayload = {
  title?: string;
  description?: string;
  image_url?: string;
};

export async function updateAchievement(achievementId: number, payload: UpdateAchievementPayload) {
  return request<{ message: string }>(`/posts/achievement/${achievementId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function uploadProfileImage(file: File) {
  const authSession = getAuthSession();
  if (!authSession) {
    return { success: false, error: "Not authenticated", status: 401 };
  }

  const formData = new FormData();
  formData.append("image", file);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/profile-image`, {
      method: "POST",
      headers: {
        "X-Auth-User-Id": authSession.userId,
        "X-Auth-Role": authSession.role,
      },
      body: formData,
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: data?.error || response.statusText || "Unknown error",
      status: response.status,
    };
  }

  return { success: true, data };
}

export async function deleteProfileImage() {
  const authSession = getAuthSession();
  if (!authSession) {
    return { success: false, error: "Not authenticated", status: 401 };
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/profile-image`, {
      method: "DELETE",
      headers: {
        "X-Auth-User-Id": authSession.userId,
        "X-Auth-Role": authSession.role,
      },
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: data?.error || response.statusText || "Unknown error",
      status: response.status,
    };
  }

  return { success: true, data };
}

export type Attachment = {
  url: string;
  name: string;
  type: string;
};

export type GurupadigamMessage = {
  id: number;
  admin_id: number;
  admin_name: string;
  title: string;
  description: string;
  attachment_url: Attachment[] | null;
  is_published: number;
  created_at: string;
};

export async function getGurupadigamMessages() {
  return request<GurupadigamMessage[]>("/gurupadigam", { method: "GET" });
}

export async function getGurupadigamMessage(id: number) {
  return request<GurupadigamMessage>(`/gurupadigam/${id}`, { method: "GET" });
}

export async function createGurupadigamMessage(data: {
  title: string;
  description: string;
  is_published?: boolean;
  attachments?: File[];
}) {
  const authSession = getAuthSession();
  if (!authSession) {
    return { success: false, error: "Not authenticated", status: 401 };
  }

  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description || "");
  formData.append("is_published", data.is_published ? "1" : "0");
  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file) => {
      formData.append("attachment", file);
    });
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/gurupadigam`, {
      method: "POST",
      headers: {
        "X-Auth-User-Id": authSession.userId,
        "X-Auth-Role": authSession.role,
      },
      body: formData,
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }

  const responseData = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: responseData?.error || response.statusText || "Unknown error",
      status: response.status,
    };
  }

  return { success: true, data: responseData };
}

export async function updateGurupadigamMessage(
  id: number,
  data: {
    title: string;
    description: string;
    is_published?: boolean;
    attachments?: File[];
  }
) {
  const authSession = getAuthSession();
  if (!authSession) {
    return { success: false, error: "Not authenticated", status: 401 };
  }

  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description || "");
  formData.append("is_published", data.is_published ? "1" : "0");
  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file) => {
      formData.append("attachment", file);
    });
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/gurupadigam/${id}`, {
      method: "PUT",
      headers: {
        "X-Auth-User-Id": authSession.userId,
        "X-Auth-Role": authSession.role,
      },
      body: formData,
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }

  const responseData = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: responseData?.error || response.statusText || "Unknown error",
      status: response.status,
    };
  }

  return { success: true, data: responseData };
}

export async function deleteGurupadigamMessage(id: number) {
  const authSession = getAuthSession();
  if (!authSession) {
    return { success: false, error: "Not authenticated", status: 401 };
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/gurupadigam/${id}`, {
      method: "DELETE",
      headers: {
        "X-Auth-User-Id": authSession.userId,
        "X-Auth-Role": authSession.role,
      },
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: data?.error || response.statusText || "Unknown error",
      status: response.status,
    };
  }

  return { success: true, data };
}