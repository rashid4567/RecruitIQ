export interface ValidationErrors {
  [key: string]: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

export interface CandidateProfileData {
  fullName?: string;
  currentJob?: string;
  experienceYears?: string | number;
  educationLevel?: string;
  gender?: string;
  currentJobLocation?: string;
  preferredJobLocation?: string[] | string;
  skills?: string[] | string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  profileImage?: File;
}

const validationRules = {
  fullName: {
    required: true,
    validate: (value: string): string | null => {
      if (!value || value.trim() === '') return 'Full name is required';
      if (value.length < 2) return 'Full name must be at least 2 characters';
      if (value.length > 100) return 'Full name must not exceed 100 characters';
      if (!/^[A-Za-z\s'-]+$/.test(value)) return 'Full name can only contain letters, spaces, hyphens, and apostrophes';
      return null;
    }
  },

  currentJob: {
    validate: (value: string): string | null => {
      if (!value || value.trim() === '') return null;
      if (value.length > 100) return 'Current job must not exceed 100 characters';
      return null;
    }
  },

  experienceYears: {
    validate: (value: string | number | undefined): string | null => {
      if (value === undefined || value === null || value === '' || value === '0') return null;
      const numValue = Number(value);
      if (isNaN(numValue)) return 'Experience must be a number';
      if (numValue < 0) return 'Experience cannot be negative';
      if (numValue > 50) return 'Experience cannot exceed 50 years';
      return null;
    }
  },

  educationLevel: {
    validate: (value: string): string | null => {
      const validLevels = ['high-school', 'associate', 'bachelor', 'master', 'phd', 'other'];
      if (!value || value.trim() === '') return null;
      if (!validLevels.includes(value)) return 'Please select a valid education level';
      return null;
    }
  },

  gender: {
    validate: (value: string): string | null => {
      const validGenders = ['male', 'female', 'non-binary', 'prefer-not-to-say', 'other'];
      if (!value || value.trim() === '') return null;
      if (!validGenders.includes(value)) return 'Please select a valid gender';
      return null;
    }
  },

  currentJobLocation: {
    validate: (value: string): string | null => {
      if (!value || value.trim() === '') return null;
      if (value.length > 100) return 'Location must not exceed 100 characters';
      if (value.length < 2) return 'Location must be at least 2 characters';
      return null;
    }
  },

  preferredJobLocation: {
    validate: (value: string[] | string | undefined): string | null => {
      if (!value) return null;

      let locations: string[] = [];
      if (typeof value === 'string') {
        locations = value.split(',').map(loc => loc.trim()).filter(loc => loc.length > 0);
      } else {
        locations = value;
      }

      for (const location of locations) {
        if (location.length > 50) return 'Each location must not exceed 50 characters';
        if (location.length < 2) return 'Location must be at least 2 characters';
        if (!/^[A-Za-z\s,'-]+$/.test(location)) return 'Locations can only contain letters, spaces, commas, hyphens, and apostrophes';
      }

      if (locations.length > 10) return 'Maximum 10 preferred locations allowed';

      return null;
    }
  },

  skills: {
    validate: (value: string[] | string | undefined): string | null => {
      if (!value) return null;

      let skills: string[] = [];
      if (typeof value === 'string') {
        skills = value.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
      } else {
        skills = value;
      }

      for (const skill of skills) {
        if (skill.length > 50) return 'Each skill must not exceed 50 characters';
        if (skill.length < 2) return 'Skill must be at least 2 characters';
        if (!/^[A-Za-z0-9\s\-#.+()/]+$/.test(skill)) return 'Skills can only contain letters, numbers, spaces, hyphens, and basic symbols';
      }

      if (skills.length > 50) return 'Maximum 50 skills allowed';

      return null;
    }
  },

  linkedinUrl: {
    validate: (value: string): string | null => {
      if (!value || value.trim() === '') return null;

      let url = value.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      try {
        new URL(url);
      } catch {
        return 'Please enter a valid URL';
      }

      const linkedinPatterns = [
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9-]+\/?$/i,
        /^(https?:\/\/)?(www\.)?linkedin\.com\/pub\/[A-Za-z0-9-]+\/?$/i,
        /^(https?:\/\/)?(www\.)?linkedin\.com\/company\/[A-Za-z0-9-]+\/?$/i
      ];

      const isValidLinkedIn = linkedinPatterns.some(pattern => pattern.test(url));
      if (!isValidLinkedIn) {
        return 'Please enter a valid LinkedIn profile URL';
      }

      return null;
    }
  },

  portfolioUrl: {
    validate: (value: string): string | null => {
      if (!value || value.trim() === '') return null;

      let url = value.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      try {
        const parsedUrl = new URL(url);
        if (!parsedUrl.protocol.match(/^https?:$/)) {
          return 'URL must start with http:// or https://';
        }
      } catch {
        return 'Please enter a valid URL';
      }

      if (url.length > 200) return 'Portfolio URL must not exceed 200 characters';

      return null;
    }
  },

  bio: {
    validate: (value: string): string | null => {
      if (!value || value.trim() === '') return null;
      if (value.length > 500) return 'Bio must not exceed 500 characters';
      return null;
    }
  },

  profileImage: {
    validate: (file: File): string | null => {
      if (!file) return null;

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type.toLowerCase())) {
        return 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)';
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return 'Image size must be less than 5MB';
      }

      return null;
    }
  }
};

type ValidationRuleKey = keyof typeof validationRules;
export const validateField = (field: string, value: CandidateProfileData[keyof CandidateProfileData]): string | null => {
  const rule = validationRules[field as ValidationRuleKey];

  if (!rule) {
    console.warn(`No validation rule found for field: ${field}`);
    return null;
  }

  return (rule.validate as (v: typeof value) => string | null)(value);
};
export const sanitizeCandidateData = (data: CandidateProfileData): CandidateProfileData => {
  const sanitized: CandidateProfileData = { ...data };
  const stringFields = (
    ['fullName', 'currentJob', 'educationLevel', 'gender',
     'currentJobLocation', 'linkedinUrl', 'portfolioUrl', 'bio'] as const
  );

  stringFields.forEach(field => {
    const val = sanitized[field];
    if (typeof val === 'string') {
      (sanitized[field] as string) = val.trim();
    }
  });

  if (typeof sanitized.preferredJobLocation === 'string') {
    sanitized.preferredJobLocation = sanitized.preferredJobLocation
      .split(',')
      .map((loc: string) => loc.trim())
      .filter((loc: string) => loc.length > 0);
  }

  if (typeof sanitized.skills === 'string') {
    sanitized.skills = sanitized.skills
      .split(',')
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill.length > 0);
  }


  if (typeof sanitized.experienceYears === 'string') {
    sanitized.experienceYears = sanitized.experienceYears === ''
      ? undefined
      : Number(sanitized.experienceYears);
  }

 
  if (sanitized.linkedinUrl && !sanitized.linkedinUrl.startsWith('http')) {
    sanitized.linkedinUrl = 'https://' + sanitized.linkedinUrl;
  }

  if (sanitized.portfolioUrl && !sanitized.portfolioUrl.startsWith('http')) {
    sanitized.portfolioUrl = 'https://' + sanitized.portfolioUrl;
  }


  (Object.keys(sanitized) as Array<keyof CandidateProfileData>).forEach(key => {
    const val = sanitized[key];
    if (val === '' || val === null || val === undefined) {
      delete sanitized[key];
    }
  });

  return sanitized;
};


export const validateCandidateProfile = (data: CandidateProfileData): ValidationResult => {
  const errors: ValidationErrors = {};


  (Object.keys(data) as Array<keyof CandidateProfileData>).forEach(field => {
    const error = validateField(field, data[field]);
    if (error) {
      errors[field] = error;
    }
  });


  if (data.currentJob && !data.currentJobLocation) {
    errors.currentJobLocation = 'Please specify your current location if you have a current job';
  }

  if (!data.fullName || data.fullName.trim() === '') {
    errors.fullName = 'Full name is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const getValidationErrorMessage = (field: string, error: string): string => {
  const fieldLabels: Record<string, string> = {
    fullName: 'Full Name',
    currentJob: 'Current Job',
    experienceYears: 'Years of Experience',
    educationLevel: 'Education Level',
    gender: 'Gender',
    currentJobLocation: 'Current Location',
    preferredJobLocation: 'Preferred Locations',
    skills: 'Skills',
    linkedinUrl: 'LinkedIn URL',
    portfolioUrl: 'Portfolio URL',
    bio: 'Additional Information',
    profileImage: 'Profile Image'
  };

  const fieldLabel = fieldLabels[field] || field;
  return `${fieldLabel}: ${error}`;
};

export const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const formatUrlForDisplay = (url: string): string => {
  if (!url) return '';
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
};