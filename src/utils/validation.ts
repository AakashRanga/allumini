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

