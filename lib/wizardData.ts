export const STEPS = ["Your Info", "Junk Type", "Items", "Volume", "Location", "Schedule", "Quote & Book"];

export type JunkCategory = { id: string; label: string; icon: string; desc: string; inputType: "quantity" | "pile" };
export type JunkItem = { id: string; label: string; weight: "heavy" | "medium" | "light" };
export type PileSize = { id: string; label: string; desc: string; icon: string };
export type VolumeOption = { id: string; label: string; fraction: string; desc: string; truckFill: number; comparison: string };
export type LocationOption = { id: string; label: string; icon: string; desc: string };
export type TimeSlot = { id: string; label: string; period: string };

export const JUNK_CATEGORIES: JunkCategory[] = [
    { id: "furniture", label: "Furniture Removal", icon: "🛋️", desc: "Sofas, tables, chairs, dressers", inputType: "quantity" },
    { id: "appliances", label: "Appliance Disposal", icon: "🧊", desc: "Fridges, washers, dryers, ovens", inputType: "quantity" },
    { id: "yard", label: "Yard Waste", icon: "🌿", desc: "Branches, soil, leaves, stumps", inputType: "pile" },
    { id: "construction", label: "Construction Debris", icon: "🧱", desc: "Drywall, lumber, tile, concrete", inputType: "pile" },
    { id: "electronics", label: "E-Waste Recycling", icon: "🖥️", desc: "TVs, computers, printers, cables", inputType: "quantity" },
    { id: "household", label: "General Junk", icon: "📦", desc: "Boxes, bags, miscellaneous items", inputType: "pile" },
    { id: "mattress", label: "Mattresses", icon: "🛏️", desc: "Mattresses, box springs, frames", inputType: "quantity" },
    { id: "garage", label: "Garage Cleanout", icon: "🏠", desc: "Tools, storage, equipment", inputType: "pile" },
];

export const PILE_SIZES: PileSize[] = [
    { id: "small", label: "Small Pile", desc: "A few bags or a wheelbarrow worth", icon: "📦" },
    { id: "medium", label: "Medium Pile", desc: "Dining table–sized area, fills a pickup bed", icon: "📦📦" },
    { id: "large", label: "Large Pile", desc: "Waist-high pile, half a garage bay", icon: "🏔️" },
    { id: "xl", label: "XL Pile", desc: "Chest-high or larger, fills a full garage bay", icon: "🏔️🏔️" },
];

export const CATEGORY_ITEMS: Record<string, JunkItem[]> = {
    furniture: [
        { id: "couch", label: "Couch / Sofa", weight: "heavy" },
        { id: "loveseat", label: "Loveseat", weight: "heavy" },
        { id: "recliner", label: "Recliner", weight: "heavy" },
        { id: "dining_table", label: "Dining Table", weight: "heavy" },
        { id: "chairs", label: "Chairs (set)", weight: "medium" },
        { id: "dresser", label: "Dresser", weight: "heavy" },
        { id: "desk", label: "Desk", weight: "medium" },
        { id: "bookshelf", label: "Bookshelf", weight: "medium" },
        { id: "entertainment_center", label: "Entertainment Center", weight: "heavy" },
        { id: "cabinet", label: "Cabinet", weight: "medium" },
        { id: "coffee_table", label: "Coffee Table", weight: "light" },
        { id: "end_table", label: "End Table", weight: "light" },
    ],
    appliances: [
        { id: "fridge", label: "Refrigerator", weight: "heavy" },
        { id: "washer", label: "Washing Machine", weight: "heavy" },
        { id: "dryer", label: "Dryer", weight: "heavy" },
        { id: "dishwasher", label: "Dishwasher", weight: "heavy" },
        { id: "oven", label: "Oven / Stove", weight: "heavy" },
        { id: "microwave", label: "Microwave", weight: "light" },
        { id: "water_heater", label: "Water Heater", weight: "heavy" },
        { id: "ac_unit", label: "A/C Unit", weight: "medium" },
    ],
    electronics: [
        { id: "tv", label: "TV / Monitor", weight: "medium" },
        { id: "computer", label: "Computer / Laptop", weight: "light" },
        { id: "printer", label: "Printer / Scanner", weight: "light" },
        { id: "stereo", label: "Stereo / Speakers", weight: "medium" },
        { id: "cables_misc", label: "Cables & Misc", weight: "light" },
        { id: "gaming", label: "Gaming Equipment", weight: "light" },
    ],
    mattress: [
        { id: "king_mattress", label: "King Mattress", weight: "heavy" },
        { id: "queen_mattress", label: "Queen Mattress", weight: "heavy" },
        { id: "full_mattress", label: "Full Mattress", weight: "medium" },
        { id: "twin_mattress", label: "Twin Mattress", weight: "medium" },
        { id: "box_spring", label: "Box Spring", weight: "medium" },
        { id: "bed_frame", label: "Bed Frame", weight: "medium" },
    ],
};

export const VOLUME_OPTIONS: VolumeOption[] = [
    { id: "few", label: "A Few Items", fraction: "1/8", desc: "A few small items — fits in a pickup bed", truckFill: 0.125, comparison: "About half a pickup truck bed" },
    { id: "quarter", label: "Quarter Load", fraction: "1/4", desc: "Small pile — a corner of the truck", truckFill: 0.25, comparison: "About 1 pickup truck bed" },
    { id: "half", label: "Half Load", fraction: "1/2", desc: "Medium pile — half the truck bed", truckFill: 0.5, comparison: "About 2 pickup truck beds" },
    { id: "three_quarter", label: "3/4 Load", fraction: "3/4", desc: "Large pile — most of the truck", truckFill: 0.75, comparison: "About 3 pickup truck beds" },
    { id: "full", label: "Full Load", fraction: "1", desc: "Filling the entire truck", truckFill: 1.0, comparison: "About 4 pickup truck beds" },
    { id: "multi", label: "Multiple Loads", fraction: "1+", desc: "More than one full truck load", truckFill: 1.25, comparison: "More than 4 pickup truck beds" },
];

export const LOCATION_OPTIONS: LocationOption[] = [
    { id: "curbside", label: "Curbside / Driveway", icon: "🏘️", desc: "Already outside, easy access" },
    { id: "garage", label: "Garage", icon: "🚗", desc: "Inside the garage" },
    { id: "ground_floor", label: "Ground Floor", icon: "🏠", desc: "First floor, no stairs" },
    { id: "upstairs", label: "Upstairs", icon: "⬆️", desc: "Second floor or higher" },
    { id: "basement", label: "Basement", icon: "⬇️", desc: "Below ground level" },
    { id: "backyard", label: "Backyard", icon: "🌳", desc: "Behind the house" },
];

export const TIME_SLOTS: TimeSlot[] = [
    { id: "morning", label: "8:00 – 10:00 AM", period: "Morning" },
    { id: "midday", label: "10:00 AM – 12:00 PM", period: "Midday" },
    { id: "afternoon", label: "12:00 – 2:00 PM", period: "Afternoon" },
    { id: "late", label: "2:00 – 4:00 PM", period: "Late Afternoon" },
];
