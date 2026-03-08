export type I18nString = {
  en: string;
  ja: string;
};

export type WorkProject = {
  id: string;
  title: I18nString;
  type: I18nString;
  year: string;
  role?: I18nString;
  duration?: string;
  summary: I18nString;
  description?: I18nString;
  stack: string[];
  href: string;
  image?: string;
  gallery?: string[];
  links?: {
    github?: string;
    live?: string;
  };
  achievements?: I18nString[];
};
