import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const point = z.object({ lat: z.number(), lng: z.number() });
const travelMode = z.enum(["WALK", "DRIVE", "BICYCLE", "TRANSIT"]);

export const autocompletePlacesFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ input: z.string().min(2).max(200), bias: point.nullish() })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { autocompletePlaces } = await import("./maps.server");
    return autocompletePlaces(data.input, data.bias ?? null);
  });

export const placeDetailsFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ placeId: z.string().min(1).max(400) }).parse(input))
  .handler(async ({ data }) => {
    const { placeDetails } = await import("./maps.server");
    return placeDetails(data.placeId);
  });

export const geocodeFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ address: z.string().min(2).max(300) }).parse(input))
  .handler(async ({ data }) => {
    const { geocodeAddress } = await import("./maps.server");
    return geocodeAddress(data.address);
  });

export const reverseGeocodeFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => point.parse(input))
  .handler(async ({ data }) => {
    const { reverseGeocode } = await import("./maps.server");
    return { address: await reverseGeocode(data) };
  });

export const planRouteFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ origin: point, destination: point, mode: travelMode }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { computeRoutes } = await import("./maps.server");
    const { analyseRoutes, boundingBox } = await import("./safety.server");

    const routes = await computeRoutes(data.origin, data.destination, data.mode);
    const box = boundingBox([data.origin, data.destination], 1500);
    const { data: reports } = await context.supabase
      .from("community_reports")
      .select("lat,lng,status,created_at,category")
      .gte("lat", box.minLat)
      .lte("lat", box.maxLat)
      .gte("lng", box.minLng)
      .lte("lng", box.maxLng)
      .limit(500);

    const safety = await analyseRoutes(routes, data.origin, reports ?? []);
    return { routes, safety };
  });

export const nearbyPlacesFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        center: point,
        categories: z
          .array(z.enum(["hospital", "police", "pharmacy", "transit", "open_public"]))
          .min(1)
          .max(5),
        radius: z.number().min(200).max(10000).default(2000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { nearbySafePlaces } = await import("./maps.server");
    return nearbySafePlaces(data.center, data.categories, data.radius);
  });

export const weatherFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => point.parse(input))
  .handler(async ({ data }) => {
    const { currentWeather } = await import("./maps.server");
    return currentWeather(data);
  });

export const transitFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ origin: point, destination: point }).parse(input))
  .handler(async ({ data }) => {
    const { transitAvailability } = await import("./maps.server");
    return transitAvailability(data.origin, data.destination);
  });
