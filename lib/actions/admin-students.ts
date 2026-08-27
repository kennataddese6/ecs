"use server";

import { requireAdmin } from "@/lib/auth";
import { createStudent, deleteStudent } from "@/lib/services/students";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createStudentAction(formData: FormData) {
  await requireAdmin();

  const fullName = formData.get("fullName") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const gender = formData.get("gender") as string;
  const roomDepartment = formData.get("roomDepartment") as string;
  const parentId = formData.get("parentId") as string;
  const staffId = formData.get("staffId") as string;
  const allergies = formData.get("allergies") as string;
  const medicalNotes = formData.get("medicalNotes") as string;

  if (!fullName || !dateOfBirth || !gender || !roomDepartment || !parentId || !staffId) {
    redirect("/admin/students/new?error=" + encodeURIComponent("Please complete all required student fields, including Parent and Staff assignment."));
  }

  const res = await createStudent({
    full_name: fullName,
    date_of_birth: dateOfBirth,
    gender,
    room_department: roomDepartment,
    parent_id: parentId,
    staff_id: staffId,
    allergies,
    medical_notes: medicalNotes,
  });

  if (!res.success) {
    redirect("/admin/students/new?error=" + encodeURIComponent(res.error || "Failed to register student."));
  }

  revalidatePath("/admin/students");
  revalidatePath("/admin/staff");
  redirect("/admin/students?success=" + encodeURIComponent(`Student ${fullName} registered and assigned successfully!`));
}

export async function deleteStudentAction(id: string) {
  await requireAdmin();
  await deleteStudent(id);
  revalidatePath("/admin/students");
  revalidatePath("/admin/staff");
  redirect("/admin/students?success=" + encodeURIComponent("Student record removed successfully."));
}
