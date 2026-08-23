export type FactorSource = "verified" | "community" | "unknown";
export type FactorTone = "positive" | "caution" | "alert" | "unknown";

export interface SafetyFactor {
  label: string;
  detail: string;
  source: FactorSource;
  tone: FactorTone;
}

export interface RouteSafety {
  routeId: string;
  /** 0-100, only present when enough real data was available. */
  score: number | null;
  classification: "safer" | "balanced" | "fastest" | null;
  factors: SafetyFactor[];
  unavailable: string[];
}

export interface SafetyAnalysis {
  routes: RouteSafety[];
  comparable: boolean;
  weatherAvailable: boolean;
  weatherNote: string | null;
  analysedAt: string;
}
