import { supabase } from "../../../lib/supabase";

export const createVolunteer = async (data) => {
  const { error } = await supabase.from("volunteers").insert([data]);
  if (error) console.error(error);
};

export const getVolunteers = async () => {
  const { data, error } = await supabase.from("volunteers").select("*");
  if (error) console.error(error);
  return data || [];
};