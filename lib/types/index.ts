export * from "./database";
import { ProductWithImages } from "@/lib/services/products";

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CartItemWithProduct {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  price_snapshot: number | null;
  product: ProductWithImages;
}

export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Apprenticeship"
  | "Bank"
  | "Agency"
  | "Volunteer";

export interface StaffMember {
  id: string;
  user_id?: string | null;
  full_name: string;
  preferred_name?: string | null;
  email: string;
  mobile_number: string;
  ni_number: string;
  job_title: string;
  nursery_branch: string;
  room_department: string;
  employment_type: EmploymentType;
  dbs_certificate_number: string;
  username: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_number: string;
  confirm_correct: boolean;
  agree_policies: boolean;
  agree_terms: boolean;
  assigned_students_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ParentMember {
  id: string;
  full_name: string;
  email: string;
  mobile_number: string;
  address: string;
  relationship_to_child: string;
  emergency_phone?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentMember {
  id: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  room_department: string;
  parent_id: string;
  staff_id: string;
  parent_name?: string;
  staff_name?: string;
  allergies?: string | null;
  medical_notes?: string | null;
  created_at: string;
  updated_at: string;
}
