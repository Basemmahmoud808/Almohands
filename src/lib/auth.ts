import { auth, currentUser } from '@clerk/nextjs/server';
import { createAdminClient } from './supabase/admin';
import { Profile, UserRole } from '@/types/database';

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_id', userId)
    .single();

  return profile as Profile | null;
}

export async function requireAuth(): Promise<{ userId: string; profile: Profile }> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized: User is not authenticated');
  }

  let profile = await getCurrentUserProfile();

  // Self-healing / Onboarding profile sync if profile is missing
  if (!profile) {
    const user = await currentUser();
    if (!user) throw new Error('Unauthorized');

    const supabase = createAdminClient();
    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert({
        clerk_id: user.id,
        full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'طالب جديد',
        email: user.emailAddresses[0]?.emailAddress || '',
        grade_level: 3, // Default to 3rd Secondary
        role: 'student',
      })
      .select()
      .single();

    if (error || !newProfile) {
      throw new Error(`Failed to initialize user profile: ${error?.message}`);
    }

    profile = newProfile as Profile;
  }

  return { userId, profile };
}

export async function requireRole(roles: UserRole[]): Promise<{ userId: string; profile: Profile }> {
  const authData = await requireAuth();

  if (!roles.includes(authData.profile.role)) {
    throw new Error('Forbidden: Access denied for your role');
  }

  return authData;
}
