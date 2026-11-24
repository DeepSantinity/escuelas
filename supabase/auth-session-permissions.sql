ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_login_read" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;

CREATE POLICY "profiles_select_own_or_admin"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
  OR auth.uid() = 'ea8f2351-fd94-43ba-a827-b66ea7008149'::uuid
);

REVOKE SELECT ON TABLE public.profiles FROM anon, authenticated;
REVOKE SELECT (
  id, nombre, apellido, telefono, mail, "contraseña", role, created_at, updated_at
) ON TABLE public.profiles FROM anon, authenticated;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT (id, nombre, apellido, mail, role)
ON TABLE public.profiles TO authenticated;

DO $$
BEGIN
  IF to_regprocedure('public.login_profile(text,text)') IS NOT NULL THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.login_profile(text,text) FROM PUBLIC, anon, authenticated';
  END IF;
END;
$$;
