export const SKILL_OPTIONS = ["Beginner", "Intermediate", "Advanced", "Competitive"].map((value) => ({
    value,
    label: value,
}));

/** distanceKm is absent entirely when the caller sent no coordinates. */
export const formatDistance = (distanceKm?: number | null) =>
    typeof distanceKm === "number" ? `${distanceKm.toFixed(1)} km away` : "Within your city";
