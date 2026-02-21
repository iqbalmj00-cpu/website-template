export const STEPS = ["Your Info", "Junk Type", "Items", "Volume", "Location", "Schedule", "Quote & Book"];

export type JunkCategory = { id: string; label: string; icon: string; desc: string };
export type JunkItem = { id: string; label: string; weight: "heavy" | "medium" | "light" };
export type VolumeOption = { id: string; label: string; fraction: string; desc: string; truckFill: number; price: [number, number] };
export type LocationOption = { id: string; label: string; icon: string; desc: string };
export type TimeSlot = { id: string; label: string; period: string };

export const JUNK_CATEGORIES: JunkCategory[] = [
    { id: "furniture", label: "Furniture Removal", icon: "🛋️", desc: "Sofas, tables, chairs, dressers" },
    { id: "appliances", label: "Appliance Disposal", icon: "🧊", desc: "Fridges, washers, dryers, ovens" },
    { id: "yard", label: "Yard Waste", icon: "🌿", desc: "Branches, soil, leaves, stumps" },
    { id: "construction", label: "Construction Debris", icon: "🧱", desc: "Drywall, lumber, tile, concrete" },
    { id: "electronics", label: "E-Waste Recycling", icon: "🖥️", desc: "TVs, computers, printers, cables" },
    { id: "household", label: "General Junk", icon: "📦", desc: "Boxes, bags, miscellaneous items" },
    { id: "mattress", label: "Mattresses", icon: "🛏️", desc: "Mattresses, box springs, frames" },
    { id: "garage", label: "Garage Cleanout", icon: "🏠", desc: "Tools, storage, equipment" },
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
    yard: [
        { id: "branches", label: "Branches / Limbs", weight: "medium" },
        { id: "soil_dirt", label: "Soil / Dirt", weight: "heavy" },
        { id: "leaves_bags", label: "Bags of Leaves", weight: "light" },
        { id: "stumps", label: "Tree Stumps", weight: "heavy" },
        { id: "fencing", label: "Old Fencing", weight: "medium" },
        { id: "patio_furniture", label: "Patio Furniture", weight: "medium" },
        { id: "play_equipment", label: "Play Equipment", weight: "heavy" },
        { id: "hot_tub", label: "Hot Tub", weight: "heavy" },
    ],
    construction: [
        { id: "drywall", label: "Drywall / Sheetrock", weight: "medium" },
        { id: "lumber", label: "Lumber / Wood", weight: "medium" },
        { id: "tile", label: "Tile / Flooring", weight: "heavy" },
        { id: "concrete", label: "Concrete / Brick", weight: "heavy" },
        { id: "carpet", label: "Carpet / Padding", weight: "medium" },
        { id: "roofing", label: "Roofing Materials", weight: "medium" },
        { id: "cabinets", label: "Old Cabinets", weight: "heavy" },
        { id: "windows", label: "Windows / Doors", weight: "medium" },
    ],
    electronics: [
        { id: "tv", label: "TV / Monitor", weight: "medium" },
        { id: "computer", label: "Computer / Laptop", weight: "light" },
        { id: "printer", label: "Printer / Scanner", weight: "light" },
        { id: "stereo", label: "Stereo / Speakers", weight: "medium" },
        { id: "cables_misc", label: "Cables & Misc", weight: "light" },
        { id: "gaming", label: "Gaming Equipment", weight: "light" },
    ],
    household: [
        { id: "boxes", label: "Boxes / Bins", weight: "light" },
        { id: "bags", label: "Trash Bags", weight: "light" },
        { id: "clothing", label: "Clothing / Textiles", weight: "light" },
        { id: "books", label: "Books / Papers", weight: "medium" },
        { id: "toys", label: "Toys / Kids Items", weight: "light" },
        { id: "exercise", label: "Exercise Equipment", weight: "heavy" },
        { id: "misc_large", label: "Large Misc Items", weight: "medium" },
    ],
    mattress: [
        { id: "king_mattress", label: "King Mattress", weight: "heavy" },
        { id: "queen_mattress", label: "Queen Mattress", weight: "heavy" },
        { id: "full_mattress", label: "Full Mattress", weight: "medium" },
        { id: "twin_mattress", label: "Twin Mattress", weight: "medium" },
        { id: "box_spring", label: "Box Spring", weight: "medium" },
        { id: "bed_frame", label: "Bed Frame", weight: "medium" },
    ],
    garage: [
        { id: "workbench", label: "Workbench", weight: "heavy" },
        { id: "shelving", label: "Shelving Units", weight: "medium" },
        { id: "tools", label: "Old Tools", weight: "medium" },
        { id: "paint", label: "Paint Cans", weight: "light" },
        { id: "tires", label: "Tires / Wheels", weight: "medium" },
        { id: "lawn_equip", label: "Lawn Equipment", weight: "heavy" },
        { id: "storage_bins", label: "Storage Bins", weight: "light" },
        { id: "sports_equip", label: "Sports Equipment", weight: "medium" },
    ],
};

export const VOLUME_OPTIONS: VolumeOption[] = [
    { id: "few", label: "A Few Items", fraction: "1/8", desc: "A few small items — fits in a pickup bed", truckFill: 0.125, price: [75, 150] },
    { id: "quarter", label: "Quarter Load", fraction: "1/4", desc: "Small pile — a corner of the truck", truckFill: 0.25, price: [150, 250] },
    { id: "half", label: "Half Load", fraction: "1/2", desc: "Medium pile — half the truck bed", truckFill: 0.5, price: [250, 400] },
    { id: "three_quarter", label: "3/4 Load", fraction: "3/4", desc: "Large pile — most of the truck", truckFill: 0.75, price: [400, 550] },
    { id: "full", label: "Full Load", fraction: "1", desc: "Filling the entire truck", truckFill: 1.0, price: [500, 700] },
    { id: "multi", label: "Multiple Loads", fraction: "1+", desc: "More than one full truck load", truckFill: 1.25, price: [700, 1200] },
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
