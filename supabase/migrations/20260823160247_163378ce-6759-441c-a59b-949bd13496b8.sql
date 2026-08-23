CREATE OR REPLACE FUNCTION public.get_shared_journey(_token TEXT)
RETURNS TABLE (
  traveller TEXT,
  dest_address TEXT,
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  dest_lat DOUBLE PRECISION,
  dest_lng DOUBLE PRECISION,
  eta TIMESTAMPTZ,
  status TEXT,
  travel_mode TEXT,
  started_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.display_name, j.dest_address, j.current_lat, j.current_lng, j.dest_lat, j.dest_lng,
         j.eta, j.status, j.travel_mode, j.started_at, j.updated_at
  FROM public.journeys j
  LEFT JOIN public.profiles p ON p.id = j.user_id
  WHERE j.share_token = _token AND j.is_shared = true
  LIMIT 1;
$$;
REVOKE EXECUTE ON FUNCTION public.get_shared_journey(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_shared_journey(TEXT) TO anon, authenticated;