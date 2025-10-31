import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Criar cliente Supabase com permissões de service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Gerar email único para conta demo
    const timestamp = Date.now();
    const demoEmail = `demo+${timestamp}@siplan.ia`;
    const demoPassword = 'Demo@2025!';

    console.log('Creating demo account:', demoEmail);

    // Criar usuário demo
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true,
      user_metadata: {
        is_demo: true,
        demo_created_at: new Date().toISOString(),
      }
    });

    if (authError) {
      console.error('Error creating demo user:', authError);
      throw authError;
    }

    console.log('Demo account created successfully:', authData.user?.id);

    // Retornar credenciais
    return new Response(
      JSON.stringify({
        email: demoEmail,
        password: demoPassword,
        user_id: authData.user?.id,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Demo account creation error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro ao criar conta demo' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
