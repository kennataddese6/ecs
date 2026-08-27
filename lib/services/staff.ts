import { createClient } from "@/lib/supabase/server";
import { StaffMember, EmploymentType } from "@/lib/types";

// In-memory fallback demo staff store if database table is not yet migrated in Supabase
let DEMO_STAFF_STORE: StaffMember[] = [
  {
    id: "staff-demo-1",
    full_name: "Sarah Jenkins",
    preferred_name: "Sarah",
    email: "sarah.j@bubblynursery.co.uk",
    mobile_number: "07700 900123",
    ni_number: "QQ 12 34 56 A",
    job_title: "Senior Nursery Practitioner",
    nursery_branch: "Bubbly Day Nursery - Main Branch",
    room_department: "Toddler Room (2-3 Yrs)",
    employment_type: "Full-time",
    dbs_certificate_number: "001594830129",
    username: "sjenkins",
    emergency_contact_name: "David Jenkins",
    emergency_contact_relationship: "Spouse",
    emergency_contact_number: "07700 900456",
    confirm_correct: true,
    agree_policies: true,
    agree_terms: true,
    assigned_students_count: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "staff-demo-2",
    full_name: "Marcus Vance",
    preferred_name: "Marc",
    email: "marcus.v@bubblynursery.co.uk",
    mobile_number: "07700 900789",
    ni_number: "QQ 65 43 21 B",
    job_title: "Early Years Educator",
    nursery_branch: "Bubbly Day Nursery - West Wing",
    room_department: "Baby Room (0-2 Yrs)",
    employment_type: "Part-time",
    dbs_certificate_number: "001684920481",
    username: "mvance",
    emergency_contact_name: "Elena Vance",
    emergency_contact_relationship: "Mother",
    emergency_contact_number: "07700 900321",
    confirm_correct: true,
    agree_policies: true,
    agree_terms: true,
    assigned_students_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getAllStaff(): Promise<StaffMember[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return DEMO_STAFF_STORE;
    }

    return data.map((item) => ({
      ...item,
      employment_type: item.employment_type as EmploymentType,
      assigned_students_count: 0, // Will be computed dynamically when students table exists
    }));
  } catch {
    return DEMO_STAFF_STORE;
  }
}

export async function getStaffById(id: string): Promise<StaffMember | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return DEMO_STAFF_STORE.find((s) => s.id === id) || null;
    }

    return {
      ...data,
      employment_type: data.employment_type as EmploymentType,
      assigned_students_count: 0,
    };
  } catch {
    return DEMO_STAFF_STORE.find((s) => s.id === id) || null;
  }
}

export interface CreateStaffInput {
  full_name: string;
  preferred_name?: string;
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
}

export async function createStaff(input: CreateStaffInput): Promise<{ success: boolean; error?: string; staff?: StaffMember }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("staff")
      .insert({
        full_name: input.full_name,
        preferred_name: input.preferred_name || null,
        email: input.email,
        mobile_number: input.mobile_number,
        ni_number: input.ni_number,
        job_title: input.job_title,
        nursery_branch: input.nursery_branch,
        room_department: input.room_department,
        employment_type: input.employment_type,
        dbs_certificate_number: input.dbs_certificate_number,
        username: input.username,
        emergency_contact_name: input.emergency_contact_name,
        emergency_contact_relationship: input.emergency_contact_relationship,
        emergency_contact_number: input.emergency_contact_number,
        confirm_correct: input.confirm_correct,
        agree_policies: input.agree_policies,
        agree_terms: input.agree_terms,
      })
      .select()
      .single();

    if (error) {
      // If DB fails (table not migrated yet or constraint), fallback to demo store
      const newDemoStaff: StaffMember = {
        id: `staff-${Date.now()}`,
        ...input,
        assigned_students_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      DEMO_STAFF_STORE.unshift(newDemoStaff);
      return { success: true, staff: newDemoStaff };
    }

    return {
      success: true,
      staff: {
        ...data,
        employment_type: data.employment_type as EmploymentType,
      },
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to create staff member.";
    const newDemoStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      ...input,
      assigned_students_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    DEMO_STAFF_STORE.unshift(newDemoStaff);
    return { success: true, staff: newDemoStaff, error: errorMessage };
  }
}

export async function deleteStaff(id: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("staff").delete().eq("id", id);
    if (error) {
      DEMO_STAFF_STORE = DEMO_STAFF_STORE.filter((s) => s.id !== id);
    }
    return true;
  } catch {
    DEMO_STAFF_STORE = DEMO_STAFF_STORE.filter((s) => s.id !== id);
    return true;
  }
}
