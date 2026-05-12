export type ProhibitedItem = {
    item: string;
    detail: string;
};

export const PROHIBITED_ITEMS: ProhibitedItem[] = [
    { item: "Hazardous Chemicals", detail: "Pesticides, herbicides, pool chemicals, and industrial solvents." },
    { item: "Paint & Solvents", detail: "Liquid paint, paint thinner, varnish, and stains. Dried paint cans are OK." },
    { item: "Asbestos", detail: "Any material containing asbestos requires a licensed abatement contractor." },
    { item: "Car Batteries", detail: "Lead-acid batteries must be recycled at auto parts stores or hazardous waste sites." },
    { item: "Medical Waste", detail: "Needles, sharps, pharmaceuticals, and regulated medical materials." },
    { item: "Oil Drums & Tanks", detail: "Full or partially full oil drums, fuel tanks, and chemical containers." },
    { item: "Propane Tanks", detail: "Any pressurized gas tank. Exchange programs may be available at hardware stores." },
    { item: "Explosives & Ammunition", detail: "Firearms, ammunition, fireworks, and flares. Contact local authorities for disposal guidance." },
];
