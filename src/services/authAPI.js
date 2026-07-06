import { supabase } from '../lib/supabase';

// Unified Login Logic
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Determine user role by checking tables
  const userId = data.user.id;
  
  // Check Super Admin
  const { data: admin } = await supabase.from('super_admin').select('*').eq('auth_id', userId).single();
  if (admin) return { user: data.user, role: 'admin', profile: admin };

  // Check School
  const { data: school } = await supabase.from('schools').select('*').eq('auth_id', userId).single();
  if (school) return { user: data.user, role: 'school', profile: school };

  // Check Student
  const { data: student } = await supabase.from('students').select('*').eq('auth_id', userId).single();
  if (student) return { user: data.user, role: 'student', profile: student };

  return { user: data.user, role: 'unknown' };
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Student Registration
export const registerStudent = async (studentData) => {
  // 1. Create Auth User
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: studentData.email,
    password: studentData.password,
  });

  if (authError) throw authError;

  // 2. Insert into students table
  const { error: dbError } = await supabase.from('students').insert([
    {
      auth_id: authData.user.id,
      full_name: studentData.fullName,
      dob: studentData.dob,
      gender: studentData.gender,
      email: studentData.email,
      parent_name: studentData.parentName,
      state: studentData.state,
      district: studentData.district,
      address: studentData.address,
      school_id: studentData.schoolId || null,
      games_interested: studentData.games,
      photo_url: studentData.photoUrl || null
    }
  ]);

  if (dbError) throw dbError;
  return authData;
};

// School Registration
export const registerSchool = async (schoolData) => {
  // 1. Create Auth User
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: schoolData.email,
    password: schoolData.password,
  });

  if (authError) throw authError;

  // 2. Insert into schools table
  const { error: dbError } = await supabase.from('schools').insert([
    {
      auth_id: authData.user.id,
      school_name: schoolData.schoolName,
      principal_name: schoolData.principalName,
      address: schoolData.address,
      state: schoolData.state,
      district: schoolData.district,
      email: schoolData.email
    }
  ]);

  if (dbError) throw dbError;
  return authData;
};

// Fetch Active User Profile
export const getUserProfile = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const userId = session.user.id;
  
  const { data: admin } = await supabase.from('super_admin').select('*').eq('auth_id', userId).single();
  if (admin) return { role: 'admin', profile: admin };

  const { data: school } = await supabase.from('schools').select('*').eq('auth_id', userId).single();
  if (school) return { role: 'school', profile: school };

  const { data: student } = await supabase.from('students').select('*, schools(school_name)').eq('auth_id', userId).single();
  if (student) return { role: 'student', profile: student };

  return null;
};
