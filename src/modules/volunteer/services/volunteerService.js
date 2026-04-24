import { supabase } from "../../../lib/supabase";

export const createVolunteer = async (data) => {
  const { data: res, error } = await supabase
    .from("volunteers")
    .insert([
     {
  name: data.name,
  email: data.email || null,
  phone: data.phone,
  location: data.location,   // ✅ ADD THIS
  role: data.role,
  trustlevel: data.trustlevel,
  status: data.status,
  skills: data.skills || [],
},
    ]);

  return { res, error };
};

export const getVolunteers = async () => {
  const { data, error } = await supabase
    .from("volunteers")
    .select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};