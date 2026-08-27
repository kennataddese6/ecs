import { createClient } from "@/lib/supabase/server";
import { ParentMember } from "@/lib/types";

let DEMO_PARENTS_STORE: ParentMember[] = [
  {
    id: "parent-demo-1",
    full_name: "Emily Thompson",
    email: "emily.t@example.com",
    mobile_number: "07890 123456",
    address: "14 Primrose Lane, London, NW3 2AB",
    relationship_to_child: "Mother",
    emergency_phone: "07890 999888",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "parent-demo-2",
    full_name: "Robert & Clara Sterling",
    email: "sterling.family@example.com",
    mobile_number: "07711 223344",
    address: "88 Victoria Road, London, SW1A 1AA",
    relationship_to_child: "Parents",
    emergency_phone: "07711 556677",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "parent-demo-3",
    full_name: "Amina Hassan",
    email: "amina.h@example.com",
    mobile_number: "07555 667788",
    address: "42 High Street, London, E1 6AN",
    relationship_to_child: "Mother",
    emergency_phone: "07555 112233",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getAllParents(): Promise<ParentMember[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("parents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return DEMO_PARENTS_STORE;
    }

    return data as ParentMember[];
  } catch {
    return DEMO_PARENTS_STORE;
  }
}

export async function getParentById(id: string): Promise<ParentMember | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("parents")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return DEMO_PARENTS_STORE.find((p) => p.id === id) || null;
    }

    return data as ParentMember;
  } catch {
    return DEMO_PARENTS_STORE.find((p) => p.id === id) || null;
  }
}

export interface CreateParentInput {
  full_name: string;
  email: string;
  mobile_number: string;
  address: string;
  relationship_to_child: string;
  emergency_phone?: string;
}

export async function createParent(input: CreateParentInput): Promise<{ success: boolean; parent?: ParentMember; error?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("parents")
      .insert({
        full_name: input.full_name,
        email: input.email,
        mobile_number: input.mobile_number,
        address: input.address,
        relationship_to_child: input.relationship_to_child,
        emergency_phone: input.emergency_phone || null,
      })
      .select()
      .single();

    if (error || !data) {
      const newParent: ParentMember = {
        id: `parent-${Date.now()}`,
        ...input,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      DEMO_PARENTS_STORE.unshift(newParent);
      return { success: true, parent: newParent };
    }

    return { success: true, parent: data as ParentMember };
  } catch {
    const newParent: ParentMember = {
      id: `parent-${Date.now()}`,
      ...input,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    DEMO_PARENTS_STORE.unshift(newParent);
    return { success: true, parent: newParent };
  }
}

export async function deleteParent(id: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("parents").delete().eq("id", id);
    if (error) {
      DEMO_PARENTS_STORE = DEMO_PARENTS_STORE.filter((p) => p.id !== id);
    }
    return true;
  } catch {
    DEMO_PARENTS_STORE = DEMO_PARENTS_STORE.filter((p) => p.id !== id);
    return true;
  }
}
