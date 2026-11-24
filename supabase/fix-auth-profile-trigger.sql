CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  IF NEW.raw_user_meta_data ->> 'telefono' IS NOT NULL
     AND NEW.raw_user_meta_data ->> 'telefono' <> ''
     AND NEW.raw_user_meta_data ->> 'telefono' !~ '^[0-9]{1,18}$' THEN
    RAISE EXCEPTION 'El teléfono solo puede contener números.';
  END IF;

  INSERT INTO public.profiles
    (id, nombre, apellido, telefono, mail, role, created_at, updated_at)
  VALUES
    (NEW.id,
     NULLIF(NEW.raw_user_meta_data ->> 'nombre', ''),
     NULLIF(NEW.raw_user_meta_data ->> 'apellido', ''),
     NULLIF(NEW.raw_user_meta_data ->> 'telefono', ''),
     NEW.email,
     false,
     now(),
     now())
  ON CONFLICT (id) DO UPDATE
    SET nombre = COALESCE(EXCLUDED.nombre, public.profiles.nombre),
        apellido = COALESCE(EXCLUDED.apellido, public.profiles.apellido),
        telefono = COALESCE(EXCLUDED.telefono, public.profiles.telefono),
        mail = EXCLUDED.mail,
        updated_at = now();

  RETURN NEW;
END;
$function$;
