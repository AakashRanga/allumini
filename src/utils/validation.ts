export interface JobValidationError {
  company?: string;
  role?: string;
  location?: string;
  salary?: string;
  description?: string;
  applyLink?: string;
}

export function validateJobPost(data: {
  company: string;
  role: string;
  location: string;
  salary: string;
  description: string;
  applyLink?: string;
}): { isValid: boolean; errors: JobValidationError } {
  const errors: JobValidationError = {};

  if (!data.company?.trim()) {
    errors.company = "Company/Hospital name is required.";
  }
  if (!data.role?.trim()) {
    errors.role = "Job title/role is required.";
  }
  if (!data.location?.trim()) {
    errors.location = "Location is required.";
  }
  if (!data.salary?.trim()) {
    errors.salary = "Salary is required.";
  } else {
    const salaryVal = Number(data.salary.trim());
    if (isNaN(salaryVal) || salaryVal <= 0) {
      errors.salary = "Salary must be a valid positive number.";
    }
  }
  if (!data.description?.trim()) {
    errors.description = "Job description is required.";
  }

  if (data.applyLink && data.applyLink.trim()) {
    // Match standard HTTP/HTTPS URLs or domains
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
    if (!urlPattern.test(data.applyLink.trim())) {
      errors.applyLink = "Please enter a valid URL (e.g., https://saveetha.com/careers).";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatSalary(salary: string | number | undefined | null): string {
  if (salary === undefined || salary === null) return "";
  const str = String(salary).trim();
  if (!str) return "";
  
  if (/^\d+(\.\d+)?$/.test(str)) {
    return `${str} LPA`;
  }
  
  if (!str.toLowerCase().includes("lpa")) {
    return `${str} LPA`;
  }
  
  return str;
}

export interface ProfileExperienceEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface ExperienceValidationError {
  company?: string;
  role?: string;
  duration?: string;
}

export interface ProfileValidationError {
  name?: string;
  contact_number?: string;
  specialization?: string;
  experience?: ExperienceValidationError[];
}

export function validateUserProfile(data: {
  name: string;
  contact_number: string;
  specialization: string;
  previous_experience: ProfileExperienceEntry[];
}): { isValid: boolean; errors: ProfileValidationError } {
  const errors: ProfileValidationError = {};

  if (!data.name?.trim()) {
    errors.name = "Full name is required.";
  }

  const phoneDigits = (data.contact_number || "").replace(/\D/g, "");
  if (!phoneDigits) {
    errors.contact_number = "Contact number is required.";
  } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.contact_number = "Contact number must be between 10 and 15 digits.";
  }

  if (!data.specialization?.trim()) {
    errors.specialization = "Specialization is required.";
  }

  if (data.previous_experience && Array.isArray(data.previous_experience)) {
    const expErrors: ExperienceValidationError[] = [];
    let hasExpError = false;

    data.previous_experience.forEach((entry, idx) => {
      const company = (entry.company || "").trim();
      const role = (entry.role || "").trim();
      const duration = (entry.duration || "").trim();
      const description = (entry.description || "").trim();

      const entryErrors: ExperienceValidationError = {};

      // If at least one field is filled, the entry is active and needs full validation
      if (company || role || duration || description) {
        if (!company) {
          entryErrors.company = "Company name is required.";
          hasExpError = true;
        }
        if (!role) {
          entryErrors.role = "Job title/role is required.";
          hasExpError = true;
        }
        if (!duration) {
          entryErrors.duration = "Duration is required.";
          hasExpError = true;
        }
      }

      expErrors[idx] = entryErrors;
    });

    if (hasExpError) {
      errors.experience = expErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

