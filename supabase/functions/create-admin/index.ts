import { createClient } from 'npm:@supabase/supabase-js@2';
const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Content-Type':'application/json' };
Deno.serve(async request => {
 const reply = (data: unknown, status=200) => new Response(JSON.stringify(data),{status,headers});
 if(request.method==='OPTIONS') return new Response(null,{headers});
 if(request.method!=='POST') return reply({error:'Method not allowed'},405);
 const url=Deno.env.get('SUPABASE_URL')!;
 const admin=createClient(url,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
 const token=request.headers.get('Authorization')?.replace(/^Bearer /i,'');
 if(!token) return reply({error:'Login diperlukan'},401);
 const {data:{user},error:authError}=await admin.auth.getUser(token);
 if(authError || !user) return reply({error:'Sesi tidak valid'},401);
 const {data:profile}=await admin.from('profiles').select('role,aktif').eq('id',user.id).single();
 if(profile?.role!=='superadmin' || !profile.aktif) return reply({error:'Hanya superadmin aktif'},403);
 try {
   const {email,name,password}=await request.json();
   if(typeof email!=='string'||!/^\S+@\S+\.\S+$/.test(email)||typeof name!=='string'||!name.trim()||typeof password!=='string'||password.length<12||password.length>128) return reply({error:'Nama, email, dan password minimal 12 karakter wajib diisi'},400);
   const {data:created,error}=await admin.auth.admin.createUser({email:email.trim(),password,email_confirm:true,user_metadata:{nama_lengkap:name.trim()}});
   if(error || !created.user) return reply({error:error?.message || 'Gagal membuat akun'},400);
   const {data:updated,error:profileError}=await admin.from('profiles').update({role:'admin',aktif:true}).eq('id',created.user.id).select('id').single();
   if(profileError || !updated) {
     const rollback=await admin.auth.admin.deleteUser(created.user.id);
     return reply({error:rollback.error ? 'Pembuatan profil gagal; akun perlu diperiksa di Supabase.' : 'Pembuatan profil gagal. Akun baru dibatalkan.'},500);
   }
   return reply({id:created.user.id,email:created.user.email});
 } catch { return reply({error:'Permintaan tidak valid'},400); }
});
