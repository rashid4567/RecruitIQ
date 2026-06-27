export const educationOptions = [
  { value: "highschool", label: "High School" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelor", label: "Bachelor's" },
  { value: "master", label: "Master's" },
  { value: "phd", label: "PhD" },
];

export const getEducationLabel = (value: string): string => {
  return educationOptions.find((opt) => opt.value === value)?.label || value;
};