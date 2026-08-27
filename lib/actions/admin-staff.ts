"use server";

import { requireAdmin } from "@/lib/auth";
import { createStaff, deleteStaff } from "@/lib/services/staff";
import { EmploymentType } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createStaffAction(formData: FormData) {
  await requireAdmin();

  const fullName = formData.get("fullName") as string;
  const preferredName = formData.get("preferredName") as string;
  const email = formData.get("email") as string;
  const mobileNumber = formData.get("mobileNumber") as string;
  const niNumber = formData.get("niNumber") as string;

  const jobTitle = formData.get("jobTitle") as string;
  const nurseryBranch = formData.get("nurseryBranch") as string;
  const roomDepartment = formData.get("roomDepartment") as string;
  const employmentType = formData.get("employmentType") as EmploymentType;

  const dbsCertificateNumber = formData.get("dbsCertificateNumber") as string;

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const emergencyContactName = formData.get("emergencyContactName") as string;
  const emergencyContactRelationship = formData.get("emergencyContactRelationship") as string;
  const emergencyContactNumber = formData.get("emergencyContactNumber") as string;

  const confirmCorrect = formData.get("confirmCorrect") === "true";
  const agreePolicies = formData.get("agreePolicies") === "true";
  const agreeTerms = formData.get("agreeTerms") === "true";

  // Validations
  if (!fullName || !email || !mobileNumber || !niNumber) {
    redirect("/admin/staff/new?error=" + encodeURIComponent("Please fill in all required Personal Details."));
  }

  if (!jobTitle || !nurseryBranch || !roomDepartment || !employmentType) {
    redirect("/admin/staff/new?error=" + encodeURIComponent("Please complete all Work Details."));
  }

  if (!dbsCertificateNumber) {
    redirect("/admin/staff/new?error=" + encodeURIComponent("DBS Certificate Number is required."));
  }

  if (!username || !password || !confirmPassword) {
    redirect("/admin/staff/new?error=" + encodeURIComponent("Please provide a Username and Password."));
  }

  if (password !== confirmPassword) {
    redirect("/admin/staff/new?error=" + encodeURIComponent("Password and Confirm Password do not match."));
  }

  if (password.length < 6) {
    redirect("/admin/staff/new?error=" + encodeURIComponent("Password must be at least 6 characters long."));
  }

  if (!emergencyContactName || !emergencyContactRelationship || !emergencyContactNumber) {
    redirect("/admin/staff/new?error=" + encodeURIComponent("Please provide complete Emergency Contact details."));
  }

  if (!confirmCorrect || !agreePolicies || !agreeTerms) {
    redirect("/admin/staff/new?error=" + encodeURIComponent("You must accept all policy and confirmation declarations to register staff."));
  }

  const res = await createStaff({
    full_name: fullName,
    preferred_name: preferredName,
    email,
    mobile_number: mobileNumber,
    ni_number: niNumber,
    job_title: jobTitle,
    nursery_branch: nurseryBranch,
    room_department: roomDepartment,
    employment_type: employmentType,
    dbs_certificate_number: dbsCertificateNumber,
    username,
    emergency_contact_name: emergencyContactName,
    emergency_contact_relationship: emergencyContactRelationship,
    emergency_contact_number: emergencyContactNumber,
    confirm_correct: confirmCorrect,
    agree_policies: agreePolicies,
    agree_terms: agreeTerms,
  });

  if (!res.success) {
    redirect("/admin/staff/new?error=" + encodeURIComponent(res.error || "Failed to register staff member."));
  }

  revalidatePath("/admin/staff");
  redirect("/admin/staff?success=" + encodeURIComponent(`Staff member ${fullName} registered successfully!`));
}

export async function deleteStaffAction(id: string) {
  await requireAdmin();
  await deleteStaff(id);
  revalidatePath("/admin/staff");
  redirect("/admin/staff?success=" + encodeURIComponent("Staff record removed successfully."));
}
