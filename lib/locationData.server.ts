import "server-only";
import {
    buildLocations,
    getExplicitServiceAreaLocations,
    type LocationData,
    type LocationSourcedContent,
    type LocationSourcedContentResolver,
} from "./locationData";
import { getSourcedLocationContent } from "./sourcedLocationContent";

const resolveSourcedContent: LocationSourcedContentResolver = (slug: string): LocationSourcedContent | null => {
    return getSourcedLocationContent(slug);
};

export function getLocations(): LocationData[] {
    return buildLocations(resolveSourcedContent);
}

export function getLocationBySlug(slug: string): LocationData | undefined {
    return getLocations().find((loc) => loc.slug === slug);
}

export function getIndexableLocations(): LocationData[] {
    return getLocations().filter(location => location.isMainCity || location.isExplicit);
}

export { getExplicitServiceAreaLocations };
export type { LocationData, LocationSourcedContent };
