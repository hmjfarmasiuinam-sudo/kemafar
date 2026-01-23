import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/api/supabase-admin';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      );
    }

    // Create Supabase client with service role
    const { client: supabaseAdmin, error: clientError } = createSupabaseAdmin();
    if (clientError || !supabaseAdmin) {
      return clientError ?? NextResponse.json({ error: 'Failed to create admin client' }, { status: 500 });
    }

    // Verify the user making the request
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      console.error('Auth error:', userError);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is super_admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'super_admin') {
      console.error('Permission error:', profileError);
      return NextResponse.json(
        { error: 'Forbidden - super_admin only' },
        { status: 403 }
      );
    }

    // Get request body
    const { email, password, full_name, role } = await request.json();

    if (!email || !password || !full_name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the new user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });

    if (createError) {
      console.error('Create user error:', createError);
      throw createError;
    }

    // Update profile with role
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        role,
        full_name,
        updated_at: new Date().toISOString(),
      })
      .eq('id', newUser.user.id);

    if (updateError) {
      console.error('Update profile error:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
      },
    });
  } catch (error) {
    console.error('Fatal error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
