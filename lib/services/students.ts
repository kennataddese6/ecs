import { createClient } from "@/lib/supabase/server";
import { StudentMember } from "@/lib/types";
import { getAllParents } from "@/lib/services/parents";
import { getAllStaff } from "@/lib/services/staff";

let DEMO_STUDENTS_STORE: StudentMember[] = [
  {
    id: "student-demo-1",
    full_name: "Oliver Thompson",
    date_of_birth: "2022-05-14",
    gender: "Male",
    room_department: "Toddler Room (2-3 Yrs)",
    parent_id: "parent-demo-1",
    staff_id: "staff-demo-1",
    parent_name: "Emily Thompson",
    staff_name: "Sarah Jenkins",
    allergies: "Peanuts",
    medical_notes: "Carries EpiPen",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "student-demo-2",
    full_name: "Sophie Sterling",
    date_of_birth: "2023-01-20",
    gender: "Female",
    room_department: "Baby Room (0-2 Yrs)",
    parent_id: "parent-demo-2",
    staff_id: "staff-demo-2",
    parent_name: "Robert & Clara Sterling",
    staff_name: "Marcus Vance",
    allergies: null,
    medical_notes: "Dairy sensitive",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "student-demo-3",
    full_name: "Leo Thompson",
    date_of_birth: "2023-09-10",
    gender: "Male",
    room_department: "Toddler Room (2-3 Yrs)",
    parent_id: "parent-demo-1",
    staff_id: "staff-demo-1",
    parent_name: "Emily Thompson",
    staff_name: "Sarah Jenkins",
    allergies: null,
    medical_notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function countStaffAssignedStudents(staffId: string): Promise<number> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("staff_id", staffId);

    if (error || count === null) {
      return DEMO_STUDENTS_STORE.filter((s) => s.staff_id === staffId).length;
    }
    return count;
  } catch {
    return DEMO_STUDENTS_STORE.filter((s) => s.staff_id === staffId).length;
  }
}

export async function getAllStudents(): Promise<StudentMember[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });

    const [parents, staffList] = await Promise.all([getAllParents(), getAllStaff()]);

    if (error || !data) {
      return DEMO_STUDENTS_STORE.map((s) => {
        const parent = parents.find((p) => p.id === s.parent_id);
        const staff = staffList.find((st) => st.id === s.staff_id);
        return {
          ...s,
          parent_name: parent?.full_name || s.parent_name || "Unknown Parent",
          staff_name: staff?.full_name || s.staff_name || "Unassigned",
        };
      });
    }

    return data.map((item) => {
      const parent = parents.find((p) => p.id === item.parent_id);
      const staff = staffList.find((st) => st.id === item.staff_id);
      return {
        ...item,
        parent_name: parent?.full_name || "Unknown Parent",
        staff_name: staff?.full_name || "Unassigned",
      };
    });
  } catch {
    return DEMO_STUDENTS_STORE;
  }
}

export interface CreateStudentInput {
  full_name: string;
  date_of_birth: string;
  gender: string;
  room_department: string;
  parent_id: string;
  staff_id: string;
  allergies?: string;
  medical_notes?: string;
}

export async function createStudent(input: CreateStudentInput): Promise<{ success: boolean; student?: StudentMember; error?: string }> {
  // Enforce rule: 1 staff member has AT MOST 3 assigned students
  const currentCount = await countStaffAssignedStudents(input.staff_id);
  if (currentCount >= 3) {
    return {
      success: false,
      error: "Selected staff member has reached the maximum capacity of 3 assigned students. Please assign another staff member.",
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("students")
      .insert({
        full_name: input.full_name,
        date_of_birth: input.date_of_birth,
        gender: input.gender,
        room_department: input.room_department,
        parent_id: input.parent_id,
        staff_id: input.staff_id,
        allergies: input.allergies || null,
        medical_notes: input.medical_notes || null,
      })
      .select()
      .single();

    if (error || !data) {
      const newStudent: StudentMember = {
        id: `student-${Date.now()}`,
        ...input,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      DEMO_STUDENTS_STORE.unshift(newStudent);
      return { success: true, student: newStudent };
    }

    return { success: true, student: data as StudentMember };
  } catch {
    const newStudent: StudentMember = {
      id: `student-${Date.now()}`,
      ...input,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    DEMO_STUDENTS_STORE.unshift(newStudent);
    return { success: true, student: newStudent };
  }
}

export async function deleteStudent(id: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) {
      DEMO_STUDENTS_STORE = DEMO_STUDENTS_STORE.filter((s) => s.id !== id);
    }
    return true;
  } catch {
    DEMO_STUDENTS_STORE = DEMO_STUDENTS_STORE.filter((s) => s.id !== id);
    return true;
  }
}
