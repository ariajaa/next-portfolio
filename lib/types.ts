export interface Profile {
  id: number;
  full_name: string;
  role_title: string;
  hero_subtitle: string;
  about_description: string;
  education: string;
  domicile: string;
  interests: string;
  email: string;
  whatsapp: string;
  cv_file: string | null;
  photo_file: string | null;
  updated_at?: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level_percent: number;
  icon_class: string;
  order_index: number;
  created_at?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string;
  category?: string;
  demo_url: string | null;
  github_url: string | null;
  image_file: string | null;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface Experience {
  id: number;
  role: string;
  organization: string;
  period: string;
  type: string;
  description: string;
  order_index: number;
  created_at?: string;
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  year: string;
  credential_url: string | null;
  image_file: string | null;
  order_index: number;
  created_at?: string;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  ip_address: string | null;
  is_read: boolean;
  created_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
  full_name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}
