/**
 * serviceData.ts - Master catalog of all junk removal services.
 * Each client's website only renders services that match siteConfig.services.
 */

import { isSameDayEnabled, siteConfig } from "./siteConfig";

type ServiceCopyBlock = { title: string; desc: string };

export interface ServiceDetail {
    slug: string;
    title: string;
    names: string[];
    keywordSynonyms?: string[];
    icon: string;
    shortDesc: string;
    fullDesc: string;
    heroSubtitle: string;
    serviceIntro: string;
    items: ServiceCopyBlock[];
    useCases: ServiceCopyBlock[];
    audience: ServiceCopyBlock[];
    pricingFactors: string[];
    preparationTips: string[];
    procesSteps: ServiceCopyBlock[];
    faqs: { q: string; a: string }[];
}

const sameDayAnswer = isSameDayEnabled()
    ? "Same-day and next-day pickup windows may be available when schedule capacity allows."
    : "Pickup windows depend on the schedule. Use the booking flow or call to see the next available appointment.";

export const ALL_SERVICES: ServiceDetail[] = [
    {
        slug: "junk-removal",
        title: "Junk Removal",
        names: ["Junk Removal", "General Junk Removal", "junk-removal"],
        keywordSynonyms: ["junk pickup", "junk hauling", "trash removal", "debris removal"],
        icon: "Trash2",
        shortDesc: "Full-service junk removal for homes, rentals, offices, and cleanout projects.",
        fullDesc: "From a single bulky item to a larger cleanout, the crew handles lifting, loading, hauling, and basic cleanup around the loaded area. Approved items are routed for donation, recycling, or disposal when appropriate local options are available.",
        heroSubtitle: "Get full-service junk pickup, junk hauling, and debris removal with clear pricing before loading begins.",
        serviceIntro: "Full-service junk removal is for customers who want bulky items, clutter, trash, and debris removed without renting a dumpster or doing the loading themselves. The page covers what can be hauled, how pricing is estimated, and what to expect before the crew starts work.",
        items: [
            { title: "Household Junk", desc: "Boxes, bags, decor, old belongings, and mixed clutter from inside the home." },
            { title: "Garage & Basement Items", desc: "Storage bins, tools, shelving, exercise equipment, and accumulated household items." },
            { title: "Renovation Debris", desc: "Drywall, lumber, tile, flooring, and other approved project debris." },
            { title: "Furniture", desc: "Couches, tables, chairs, mattresses, bed frames, desks, and bulky furniture." },
            { title: "Appliances", desc: "Washers, dryers, refrigerators, stoves, dishwashers, and other accepted appliances." },
            { title: "Outdoor Debris", desc: "Yard debris, fencing, patio items, play equipment, and other approved outdoor junk." },
        ],
        useCases: [
            { title: "One-item pickup", desc: "Useful when a single sofa, appliance, mattress, or heavy item needs to be removed." },
            { title: "Room and garage clearing", desc: "Good for decluttering a room, garage, basement, attic, or storage area." },
            { title: "Move-out cleanup", desc: "Helps homeowners, renters, landlords, and property managers remove leftover items before a move or turnover." },
        ],
        audience: [
            { title: "Homeowners and renters", desc: "For everyday junk pickup, furniture removal, appliance removal, and cleanup projects." },
            { title: "Landlords and realtors", desc: "For rental turnovers, listing prep, garage cleanouts, and leftover item removal." },
            { title: "Businesses and property teams", desc: "For approved office junk, commercial debris, and recurring cleanup needs." },
        ],
        pricingFactors: [
            "How much space the items take in the truck",
            "Item weight and material type",
            "Stairs, elevators, gates, or carry distance",
            "Disassembly, sorting, or specialty handling needs",
        ],
        preparationTips: [
            "Separate anything you want to keep before the appointment.",
            "Enter the load details, pickup address, and access notes when booking.",
            "Mention stairs, elevators, parking limits, gates, or long carry distance.",
        ],
        procesSteps: [
            { title: "Enter job details", desc: "Use the booking flow or call with service type, load size, pickup address, access notes, and preferred schedule." },
            { title: "Review the quote", desc: "Review the quote in the booking flow before submitting the booking request." },
            { title: "Items are hauled away", desc: "Approved items are loaded, hauled away, and routed through available local options." },
        ],
        faqs: [
            { q: "What items do junk removal companies take?", a: "Common accepted items include furniture, appliances, mattresses, electronics, yard debris, renovation debris, and mixed household junk. Hazardous or regulated materials are not accepted." },
            { q: "How much does junk removal cost?", a: "Pricing is usually based on truck volume, item weight, access, and handling requirements. The crew confirms the final price before loading begins." },
            { q: "Do you offer same-day junk removal?", a: sameDayAnswer },
            { q: "Do I need to move everything outside?", a: "No. Full-service junk removal can include carry-out from inside, outside, garages, storage units, offices, or job sites when access is safe." },
        ],
    },
    {
        slug: "demolition",
        title: "Light Demolition",
        names: ["Demolition", "Light Demolition", "Demo", "demolition"],
        keywordSynonyms: ["shed removal", "shed demolition", "deck removal", "fence removal", "tear-out removal"],
        icon: "Hammer",
        shortDesc: "Light demolition and haul-away for sheds, decks, fences, fixtures, and small tear-outs.",
        fullDesc: "Light demolition covers non-structural removal work such as sheds, fences, decks, cabinets, fixtures, and small outdoor structures. The crew reviews the scope, access, material type, and haul-away requirements before work begins.",
        heroSubtitle: "Remove an old shed, deck, fence, or non-structural tear-out with demolition and debris hauling planned together.",
        serviceIntro: "Light demolition is different from standard junk pickup because items may need to be dismantled before hauling. This page focuses on shed removal, outdoor structure removal, deck and fence tear-outs, and other non-structural projects that can be scoped before pickup.",
        items: [
            { title: "Shed Removal", desc: "Wood, metal, or plastic sheds that need to be dismantled and hauled away." },
            { title: "Deck Tear-Outs", desc: "Small deck sections, railings, steps, and deck boards when the scope is approved." },
            { title: "Fence Removal", desc: "Wood, vinyl, and chain-link fence sections, posts, and related debris." },
            { title: "Interior Tear-Outs", desc: "Cabinets, counters, non-structural fixtures, flooring, and trim." },
            { title: "Outdoor Structures", desc: "Playsets, pergolas, small shelters, and similar items after scope review." },
            { title: "Demo Debris", desc: "Lumber, panels, fasteners, and approved debris from the teardown." },
        ],
        useCases: [
            { title: "Shed demolition and removal", desc: "For old backyard sheds that are damaged, empty, or ready to be replaced." },
            { title: "Outdoor cleanup projects", desc: "For removing playsets, fencing, deck material, and yard structures during a property cleanup." },
            { title: "Renovation tear-outs", desc: "For small non-structural removals where debris needs to be loaded and hauled." },
        ],
        audience: [
            { title: "Homeowners", desc: "For backyard projects, fixture removal, shed removal, and pre-renovation cleanup." },
            { title: "Landlords and property managers", desc: "For clearing unsafe or unwanted small structures between tenants." },
            { title: "Contractors", desc: "For approved teardown debris and supplemental hauling after a light demo project." },
        ],
        pricingFactors: [
            "Structure size and material type",
            "Whether dismantling is required",
            "Access to the work area and truck parking",
            "Debris volume, density, and disposal requirements",
        ],
        preparationTips: [
            "Empty sheds, cabinets, or structures before the appointment when possible.",
            "Confirm utilities are disconnected by the proper professional before removal.",
            "Enter measurements, material details, and access notes before scheduling.",
        ],
        procesSteps: [
            { title: "Review the structure", desc: "Enter measurements, material details, and access notes before scheduling." },
            { title: "Confirm the scope", desc: "The crew reviews what can be dismantled, loaded, and hauled before work begins." },
            { title: "Remove and haul debris", desc: "Approved material is broken down as quoted, loaded, and hauled away." },
        ],
        faqs: [
            { q: "Do you handle shed removal?", a: "Shed removal may be available for wood, metal, or plastic sheds after the structure, access, and contents are reviewed." },
            { q: "Do you do structural demolition?", a: "No. This service is for light, non-structural demolition and haul-away. Structural, load-bearing, utility-connected, or permit-heavy work may require a licensed specialist." },
            { q: "Do I need a permit for light demolition?", a: "Permit rules vary by city and project type. Check local requirements before booking if the structure may require approval." },
        ],
    },
    {
        slug: "furniture-removal",
        title: "Furniture Removal",
        names: ["Furniture Removal", "Furniture", "furniture-removal"],
        keywordSynonyms: ["old furniture removal", "couch removal", "sofa removal", "furniture pickup", "furniture disposal"],
        icon: "Armchair",
        shortDesc: "Furniture removal for couches, sofas, tables, desks, mattresses, dressers, and bulky pieces.",
        fullDesc: "Furniture removal helps customers get rid of bulky pieces without carrying them to the curb. The crew reviews item size, access, stairs, and whether disassembly is needed before the final price is confirmed.",
        heroSubtitle: "Book old furniture removal for couches, sofas, dressers, tables, desks, and other bulky items.",
        serviceIntro: "Furniture removal is one of the highest-intent junk removal searches because customers usually need a bulky item gone soon and want to know who will carry it. This page explains what furniture can be removed, what affects cost, and how the appointment works.",
        items: [
            { title: "Couches & Sofas", desc: "Sofas, loveseats, sectionals, recliners, sleeper sofas, and living-room furniture." },
            { title: "Bedroom Furniture", desc: "Mattresses, box springs, bed frames, dressers, nightstands, and wardrobes." },
            { title: "Tables & Dining Sets", desc: "Dining tables, coffee tables, end tables, chairs, and cabinets." },
            { title: "Office Furniture", desc: "Desks, office chairs, filing cabinets, bookcases, and conference furniture." },
            { title: "Storage Furniture", desc: "Shelving, entertainment centers, armoires, and bulky storage pieces." },
            { title: "Outdoor Furniture", desc: "Patio tables, outdoor seating, lounge sets, and weather-worn furniture." },
        ],
        useCases: [
            { title: "Replacing old furniture", desc: "Good for removing a couch, mattress, table, or bedroom set before new furniture arrives." },
            { title: "Moving or downsizing", desc: "Useful when a home, apartment, or office needs unwanted furniture removed before a move." },
            { title: "Room cleanouts", desc: "Helps clear multiple bulky pieces from living rooms, bedrooms, garages, and storage spaces." },
        ],
        audience: [
            { title: "Homeowners and renters", desc: "For couch removal, sofa removal, mattress removal, and old furniture pickup." },
            { title: "Apartments and condos", desc: "For furniture that needs elevator, hallway, or stair access reviewed before pickup." },
            { title: "Offices", desc: "For desks, chairs, filing cabinets, and furniture from workspace updates." },
        ],
        pricingFactors: [
            "Number and size of furniture pieces",
            "Stairs, elevators, tight hallways, or long carry distance",
            "Whether disassembly is needed before removal",
            "Truck volume and item weight",
        ],
        preparationTips: [
            "Clear a path from the item to the exit when possible.",
            "Remove personal items from drawers or cabinets.",
            "Mention oversized pieces, sleeper sofas, or upstairs access when booking.",
        ],
        procesSteps: [
            { title: "List the furniture", desc: "Tell us which furniture pieces need to go and where they are located." },
            { title: "Confirm access and price", desc: "The crew reviews access and confirms the final price before loading starts." },
            { title: "Carry out and haul", desc: "Approved furniture is carried out, loaded, and hauled for appropriate routing." },
        ],
        faqs: [
            { q: "Do you remove couches and sofas?", a: "Yes. Couch removal and sofa removal are common furniture removal requests. Share size and access details when booking." },
            { q: "Can large furniture be taken apart?", a: "Some bulky items can be disassembled when the crew has confirmed the scope and included it in the quote." },
            { q: "Can you remove furniture from upstairs?", a: "Yes, when access is safe. Mention stairs, elevators, tight turns, or parking limits before the appointment." },
            { q: "What happens to old furniture after pickup?", a: "Usable or recyclable furniture may be routed to donation or recycling when appropriate local options are available. Otherwise it is taken to an approved disposal facility." },
        ],
    },
    {
        slug: "appliance-removal",
        title: "Appliance Removal",
        names: ["Appliance Removal", "Appliance Disposal", "Appliances", "appliance-removal"],
        keywordSynonyms: ["appliance disposal", "refrigerator removal", "washer dryer removal", "appliance haul away"],
        icon: "Plug",
        shortDesc: "Appliance removal for refrigerators, washers, dryers, stoves, dishwashers, and other bulky units.",
        fullDesc: "Appliances can be heavy, awkward, and subject to local handling rules. The crew reviews appliance type, access, utility disconnection status, and disposal requirements before removal.",
        heroSubtitle: "Schedule appliance removal for refrigerators, washers, dryers, stoves, dishwashers, and other large units.",
        serviceIntro: "Appliance removal targets customers who need safe lifting and haul-away for heavy household or commercial units. This page explains which appliances can be picked up, how prep works, and what can affect appliance disposal cost.",
        items: [
            { title: "Refrigerators & Freezers", desc: "Residential refrigerators, freezers, and similar cooling appliances after handling requirements are reviewed." },
            { title: "Washers & Dryers", desc: "Top-load, front-load, and stackable laundry appliances that are disconnected before pickup." },
            { title: "Ovens & Stoves", desc: "Electric ranges, wall ovens, cooktops, and stoves after utility status is confirmed." },
            { title: "Dishwashers", desc: "Built-in and portable dishwashers removed when disconnected and accessible." },
            { title: "Water Heaters", desc: "Tank and tankless units after plumbing and utility disconnection are complete." },
            { title: "Small Appliances", desc: "Microwaves, compact appliances, dehumidifiers, and other accepted units." },
        ],
        useCases: [
            { title: "New appliance replacement", desc: "Remove an old unit after a replacement has been installed or delivered." },
            { title: "Laundry-room cleanup", desc: "Clear a washer, dryer, or stacked unit after it has been disconnected." },
            { title: "Rental or property turnover", desc: "Remove non-working appliances from rental units, offices, or managed properties." },
        ],
        audience: [
            { title: "Homeowners", desc: "For refrigerator removal, washer dryer removal, stove removal, and appliance haul-away." },
            { title: "Landlords and realtors", desc: "For clearing old appliances before rental turnover, sale prep, or repairs." },
            { title: "Businesses", desc: "For accepted appliance pickup from offices, break rooms, retail spaces, or commercial properties." },
        ],
        pricingFactors: [
            "Appliance type, size, and weight",
            "Stairs, tight access, or distance from truck parking",
            "Whether doors, shelving, or surrounding items must be moved",
            "Local appliance handling or disposal requirements",
        ],
        preparationTips: [
            "Disconnect water, electrical, or gas service before the appointment when needed.",
            "Empty refrigerators, freezers, washers, dryers, and dishwashers.",
            "Tell the company about stairs, narrow doors, or built-in appliance removal before booking.",
        ],
        procesSteps: [
            { title: "Describe the appliance", desc: "Share the appliance type, location, size, and whether it is already disconnected." },
            { title: "Review access", desc: "The crew confirms access, handling requirements, and final price before removal." },
            { title: "Load and route", desc: "Approved appliances are loaded and routed through appropriate local channels when available." },
        ],
        faqs: [
            { q: "Do you remove refrigerators?", a: "Yes. Refrigerator removal is available after size, access, contents, and any local appliance handling requirements are reviewed." },
            { q: "Do appliances need to be disconnected first?", a: "Appliances should be safely disconnected before pickup. For fuel service, plumbing, or hardwired electrical work, use the appropriate licensed professional first." },
            { q: "Can you remove built-in appliances?", a: "Some built-in appliances can be removed when they are disconnected and accessible. Enter appliance details and access notes before booking." },
        ],
    },
    {
        slug: "e-waste-recycling",
        title: "E-Waste Recycling",
        names: ["E-Waste Recycling", "E-Waste", "Electronics", "e-waste-recycling"],
        keywordSynonyms: ["electronics pickup", "electronics disposal", "computer recycling", "tv removal"],
        icon: "Monitor",
        shortDesc: "Pickup and hauling for TVs, monitors, computers, printers, cables, and other accepted electronics.",
        fullDesc: "Electronic waste can require special routing depending on local rules and the item type. The crew collects approved electronics and routes them through available local disposal or recycling options.",
        heroSubtitle: "Get electronics pickup for TVs, computers, monitors, printers, cables, and accepted e-waste.",
        serviceIntro: "E-waste recycling pages should answer practical questions about what electronics can be picked up and what customers should do before handing over devices. This page keeps data privacy, item type, and local disposal requirements clear.",
        items: [
            { title: "TVs & Monitors", desc: "Flat screens, computer monitors, and many common TV types after handling requirements are reviewed." },
            { title: "Computers & Laptops", desc: "Desktops, laptops, towers, servers, keyboards, mice, and computer accessories." },
            { title: "Printers & Office Electronics", desc: "Printers, scanners, copiers, routers, phones, and small office electronics." },
            { title: "Audio & Video Equipment", desc: "Receivers, speakers, stereo equipment, DVD players, and similar electronics." },
            { title: "Cables & Accessories", desc: "Power cords, chargers, adapters, surge protectors, and peripheral items." },
            { title: "Gaming Equipment", desc: "Consoles, controllers, gaming accessories, and related electronics." },
        ],
        useCases: [
            { title: "Home office cleanup", desc: "Clear old computers, monitors, printers, and tangled cables from a workspace." },
            { title: "Business electronics removal", desc: "Remove outdated office electronics after equipment changes or cleanouts." },
            { title: "TV and monitor pickup", desc: "Schedule pickup for bulky screens that are difficult to move or transport." },
        ],
        audience: [
            { title: "Households", desc: "For old TVs, computers, printers, accessories, and electronics clutter." },
            { title: "Offices", desc: "For equipment refreshes, storage-room cleanouts, and approved electronics pickup." },
            { title: "Property managers", desc: "For tenant-left electronics and cleanout debris after access and item type are reviewed." },
        ],
        pricingFactors: [
            "Number and type of electronics",
            "Screen size and item weight",
            "Stairs, elevators, or carry distance",
            "Local e-waste processing requirements",
        ],
        preparationTips: [
            "Remove or wipe storage devices before pickup if data privacy matters.",
            "Group cables, accessories, and small electronics together.",
            "Mention large TVs, CRT-style screens, or heavy office equipment before booking.",
        ],
        procesSteps: [
            { title: "List the electronics", desc: "Share the type and quantity of electronics you need removed." },
            { title: "Confirm pickup details", desc: "The crew reviews item type, access, and final pricing before loading." },
            { title: "Route appropriately", desc: "Approved electronics are hauled and routed through available local channels." },
        ],
        faqs: [
            { q: "Do you take TVs and monitors?", a: "TV and monitor pickup may be available depending on screen type, size, access, and local handling requirements." },
            { q: "Is my data removed from computers?", a: "No data destruction is implied. Remove or wipe storage devices before pickup if data privacy matters." },
            { q: "Can offices schedule electronics disposal?", a: "Yes. Offices can request pickup for approved electronics, computers, printers, cables, and related equipment." },
        ],
    },
    {
        slug: "mattress-disposal",
        title: "Mattress Removal",
        names: ["Mattress Disposal", "Mattress Removal", "Mattresses", "mattress-disposal"],
        keywordSynonyms: ["mattress disposal", "box spring removal", "bed removal", "mattress pickup"],
        icon: "BedDouble",
        shortDesc: "Mattress removal for mattresses, box springs, bed frames, adjustable bases, and bedroom items.",
        fullDesc: "Mattresses and box springs are bulky, difficult to transport, and often require special disposal routing. The crew reviews size, quantity, access, and pickup location before loading.",
        heroSubtitle: "Book mattress removal for king, queen, full, twin, box spring, bed frame, and bedroom cleanout items.",
        serviceIntro: "Mattress removal pages should answer whether the company takes mattresses, what sizes can be hauled, and how access affects cost. This page targets mattress removal, mattress disposal, box spring removal, and bed removal intent.",
        items: [
            { title: "King & Queen Mattresses", desc: "Large mattresses including pillow-top and foam styles after access is reviewed." },
            { title: "Full & Twin Mattresses", desc: "Standard mattress sizes from bedrooms, guest rooms, apartments, and rentals." },
            { title: "Box Springs", desc: "Single or matching box springs hauled with the mattress when included in the quote." },
            { title: "Bed Frames", desc: "Metal, wood, platform, and adjustable frames when disassembly needs are clear." },
            { title: "Bedroom Furniture", desc: "Nightstands, dressers, headboards, and other bedroom junk when approved." },
            { title: "Multiple Beds", desc: "Multi-room mattress and bed removal for cleanouts or move-outs." },
        ],
        useCases: [
            { title: "Replacing a mattress", desc: "Remove the old mattress or box spring before or after a new bed arrives." },
            { title: "Apartment move-out", desc: "Clear mattresses, frames, and bedroom furniture before turning in a unit." },
            { title: "Bedroom cleanout", desc: "Remove multiple sleep-related items from a room, rental, or estate cleanout." },
        ],
        audience: [
            { title: "Homeowners and renters", desc: "For mattress pickup, box spring removal, and bed frame removal." },
            { title: "Landlords and property managers", desc: "For mattresses left behind after tenant move-outs or cleanouts." },
            { title: "Realtors and estate coordinators", desc: "For bedroom furniture and mattress removal during property prep." },
        ],
        pricingFactors: [
            "Mattress size and quantity",
            "Box spring, frame, or base included",
            "Stairs, elevator, or long carry distance",
            "Local mattress disposal or handling requirements",
        ],
        preparationTips: [
            "Strip bedding and remove personal items before pickup.",
            "Share mattress size and number of pieces when booking.",
            "Mention upstairs rooms, tight halls, elevators, or parking limits.",
        ],
        procesSteps: [
            { title: "Share mattress details", desc: "Tell us the size, quantity, and whether a box spring or bed frame is included." },
            { title: "Confirm access and price", desc: "The crew reviews the pickup location and confirms the final price before loading." },
            { title: "Remove and haul", desc: "Approved mattresses and bedroom items are carried out, loaded, and hauled away." },
        ],
        faqs: [
            { q: "Do you remove mattresses and box springs?", a: "Yes. Mattress removal can include mattresses, box springs, frames, and related bedroom items when approved for hauling." },
            { q: "Can you remove a mattress from upstairs?", a: "Yes, when access is safe. Share stair, hallway, elevator, and parking details before the appointment." },
            { q: "How many mattresses can be picked up?", a: "Quantity affects truck space and pricing. List every mattress, box spring, and frame when booking so the estimate is useful." },
        ],
    },
    {
        slug: "yard-waste-removal",
        title: "Yard Waste Removal",
        names: ["Yard Waste Removal", "Yard Waste", "Yard", "yard-waste-removal"],
        keywordSynonyms: ["yard debris removal", "brush removal", "branch removal", "outdoor junk removal"],
        icon: "TreePine",
        shortDesc: "Yard waste removal for branches, brush, bagged leaves, fencing, outdoor debris, and landscaping material.",
        fullDesc: "Yard waste removal helps clear outdoor debris after landscaping, storms, fence projects, or seasonal cleanup. Material type, pile size, weight, and access are reviewed before loading.",
        heroSubtitle: "Remove yard debris, brush, branches, bagged leaves, fencing, and other approved outdoor junk.",
        serviceIntro: "Yard waste removal targets local customers with outdoor debris piles they cannot put in normal trash. This page covers common yard debris, storm cleanup caveats, heavy material pricing, and how to prepare for outdoor pickup.",
        items: [
            { title: "Branches & Brush", desc: "Tree limbs, brush piles, clippings, and cut vegetation." },
            { title: "Bagged Leaves & Grass", desc: "Bagged leaves, grass clippings, and garden cleanup debris." },
            { title: "Fencing & Outdoor Wood", desc: "Fence sections, posts, lumber, and outdoor wood debris." },
            { title: "Soil, Rock & Gravel", desc: "Dense landscaping material after weight and access are reviewed." },
            { title: "Outdoor Junk", desc: "Planters, patio items, play equipment, and yard clutter." },
            { title: "Storm Debris", desc: "Loose outdoor debris when schedule capacity and safe access allow." },
        ],
        useCases: [
            { title: "Seasonal yard cleanup", desc: "Remove leaves, brush, branches, and garden debris after outdoor work." },
            { title: "Landscaping project cleanup", desc: "Clear soil, old edging, fencing, lumber, and material piles from a project." },
            { title: "Outdoor junk removal", desc: "Haul away patio junk, old planters, play equipment, and clutter from the yard." },
        ],
        audience: [
            { title: "Homeowners", desc: "For yard debris removal, branch pickup, and outdoor cleanup projects." },
            { title: "Landlords and property managers", desc: "For clearing outdoor debris before turnover, inspection, or listing." },
            { title: "Landscapers and contractors", desc: "For approved debris hauling after landscaping or fence projects." },
        ],
        pricingFactors: [
            "Pile size and truck volume",
            "Material weight and density",
            "Loose versus bagged debris",
            "Distance from truck access and loading conditions",
        ],
        preparationTips: [
            "Group yard debris in one accessible area when possible.",
            "Separate heavy materials such as soil, rock, concrete, or gravel.",
            "Mention storm debris, sharp material, or blocked access before booking.",
        ],
        procesSteps: [
            { title: "Describe the debris", desc: "Share the material type, pile size, and access details." },
            { title: "Confirm the load", desc: "The crew reviews volume, weight, and final price before loading." },
            { title: "Haul outdoor material", desc: "Approved yard debris is loaded and routed through available local options." },
        ],
        faqs: [
            { q: "Do you remove branches and brush?", a: "Yes. Branch removal and brush removal are common yard waste removal requests when the debris is accessible and approved for hauling." },
            { q: "Can you take soil, rock, or gravel?", a: "Dense materials can affect pricing and weight limits. Describe the material and amount before booking." },
            { q: "Do you handle storm debris?", a: "Storm debris pickup may be available depending on schedule capacity, debris type, and safe access to the pickup area." },
        ],
    },
    {
        slug: "construction-debris",
        title: "Construction Debris Removal",
        names: ["Construction Debris", "Construction Debris Removal", "Construction", "construction-debris"],
        keywordSynonyms: ["renovation debris hauling", "contractor cleanup", "construction trash hauling", "demo debris removal"],
        icon: "HardHat",
        shortDesc: "Construction debris removal for drywall, lumber, tile, flooring, cabinets, roofing material, and remodel debris.",
        fullDesc: "Construction debris removal keeps renovation and cleanup projects moving by hauling approved debris after material type, weight, access, and disposal requirements are reviewed.",
        heroSubtitle: "Clear renovation debris, drywall, lumber, tile, flooring, and approved construction trash.",
        serviceIntro: "Construction debris removal pages should speak to homeowners, DIY remodelers, contractors, and property managers. The content needs to explain accepted material types, heavy-material pricing factors, and jobsite access without promising compliance or unlimited hauling.",
        items: [
            { title: "Drywall & Sheetrock", desc: "New or demolition drywall, sheetrock, and related renovation debris." },
            { title: "Lumber & Wood", desc: "Framing lumber, trim, plywood, pallets, cabinets, and wood debris." },
            { title: "Tile & Flooring", desc: "Ceramic tile, vinyl, laminate, hardwood, carpet, and padding." },
            { title: "Concrete & Brick", desc: "Small amounts of masonry material after weight and access are reviewed." },
            { title: "Roofing Material", desc: "Shingles, underlayment, flashing, and roof debris when approved." },
            { title: "Fixtures & Cabinets", desc: "Cabinets, counters, vanities, fixtures, and remodel tear-out debris." },
        ],
        useCases: [
            { title: "Home renovation cleanup", desc: "Haul away project debris from kitchen, bath, flooring, or room remodels." },
            { title: "Contractor debris pickup", desc: "Support jobsite cleanup when a contractor needs approved debris removed." },
            { title: "DIY project hauling", desc: "Remove debris after a homeowner tear-out, flooring project, or small repair." },
        ],
        audience: [
            { title: "Homeowners", desc: "For remodel cleanup, flooring debris, cabinet removal, and DIY renovation debris." },
            { title: "Contractors", desc: "For supplemental debris hauling and scheduled construction debris pickup." },
            { title: "Property managers", desc: "For renovation, turnover, and repair debris from managed units." },
        ],
        pricingFactors: [
            "Debris type and material weight",
            "Truck volume and number of loads",
            "Access to the debris pile or jobsite",
            "Heavy-material or local disposal requirements",
        ],
        preparationTips: [
            "Separate hazardous or restricted materials before pickup.",
            "Stack or pile debris in an accessible location when possible.",
            "Describe heavy materials such as concrete, brick, tile, or shingles before booking.",
        ],
        procesSteps: [
            { title: "Share material details", desc: "Tell us what type of construction debris needs to be removed and where it is located." },
            { title: "Confirm load and access", desc: "The crew reviews material, weight, access, and final price before loading." },
            { title: "Haul approved debris", desc: "Approved construction material is loaded and routed to appropriate local facilities." },
        ],
        faqs: [
            { q: "Do you work with contractors?", a: "Contractor debris pickup can be discussed before booking based on material type, access, schedule, and load size." },
            { q: "Can you take concrete and brick?", a: "Small amounts may be accepted after weight and access are reviewed. Large heavy-material projects may require a dumpster or specialist equipment." },
            { q: "What construction materials are restricted?", a: "Hazardous or regulated material is not accepted with standard junk removal. Confirm paint, chemicals, asbestos, fuel, and similar materials before booking." },
        ],
    },
    {
        slug: "estate-cleanout",
        title: "Estate Cleanout",
        names: ["Estate Cleanouts", "Estate Cleanout", "Estate", "estate-cleanout"],
        keywordSynonyms: ["estate cleanout services", "house cleanout", "whole house cleanout", "property cleanout", "full home cleanout"],
        icon: "Home",
        shortDesc: "Estate cleanout and whole-house cleanout support for rooms, garages, storage areas, and property contents.",
        fullDesc: "Estate and whole-home cleanouts are planned around property size, item volume, access, sorting needs, privacy, and timing. The crew confirms the scope and final price before loading begins.",
        heroSubtitle: "Plan an estate cleanout, house cleanout, or full property cleanout with clear scope and pricing.",
        serviceIntro: "Estate cleanout pages need careful wording because these jobs can involve family coordination, privacy, and larger property scopes. This page covers room-by-room removal, donation routing when available, pricing factors, and preparation without claiming legal or probate expertise.",
        items: [
            { title: "Room-by-Room Contents", desc: "Furniture, boxes, household items, decor, and approved contents from multiple rooms." },
            { title: "Garage & Attic Items", desc: "Stored belongings, shelving, bins, tools, and accumulated property items." },
            { title: "Basement Cleanouts", desc: "Approved basement items after access, stairs, and safety conditions are reviewed." },
            { title: "Storage Areas", desc: "Storage rooms, sheds, closets, and other areas tied to a property cleanout." },
            { title: "Move-Out Debris", desc: "Leftover items, unwanted furniture, and approved junk before turnover or listing." },
            { title: "Donation-Eligible Items", desc: "Usable items can be set aside for donation routing when a local option accepts them." },
        ],
        useCases: [
            { title: "Estate cleanout", desc: "Clear unwanted items after a family transition, property sale, or estate process." },
            { title: "Whole-house cleanout", desc: "Remove approved contents from multiple rooms, garages, attics, and storage areas." },
            { title: "Downsizing or move-out", desc: "Help reduce belongings before a move, sale, rental turnover, or listing prep." },
        ],
        audience: [
            { title: "Families and homeowners", desc: "For larger cleanouts that require careful pacing and clear communication." },
            { title: "Realtors and landlords", desc: "For preparing properties before listing, repairs, or tenant turnover." },
            { title: "Estate coordinators", desc: "For property cleanout logistics after sorting decisions are made." },
        ],
        pricingFactors: [
            "Property size and number of rooms",
            "Truck volume and item weight",
            "Sorting, staging, or donation-routing needs",
            "Access, stairs, parking, and schedule requirements",
        ],
        preparationTips: [
            "Identify items that should stay before the crew arrives.",
            "Set aside documents, keepsakes, valuables, and donation items when possible.",
            "Share property access, parking, and sorting needs before booking.",
        ],
        procesSteps: [
            { title: "Walk through the scope", desc: "Review which rooms, storage areas, and item categories need to be cleared." },
            { title: "Confirm the cleanout plan", desc: "The crew confirms price, access, sorting needs, and loading plan before work begins." },
            { title: "Load approved items", desc: "Approved contents are removed and routed through available local options." },
        ],
        faqs: [
            { q: "Do you handle estate cleanout services?", a: "Yes. Estate cleanout service can include room-by-room removal, storage areas, furniture, and approved property contents after scope review." },
            { q: "Can you help with a whole-house cleanout?", a: "Yes. Whole-house cleanouts are priced by property size, item volume, access, sorting needs, and number of loads." },
            { q: "Can items be separated for donation?", a: "Items can be set aside for donation routing when a local donation option accepts them. Confirm donation needs before the cleanout." },
        ],
    },
    {
        slug: "garage-cleanout",
        title: "Garage Cleanout",
        names: ["Garage Cleanouts", "Garage Cleanout", "Garage", "garage-cleanout"],
        keywordSynonyms: ["garage junk removal", "garage cleanup", "garage cleanout service", "garage haul away"],
        icon: "Warehouse",
        shortDesc: "Garage cleanout service for boxes, tools, shelving, storage bins, lawn equipment, and bulky junk.",
        fullDesc: "Garage cleanouts help clear accumulated items, seasonal storage, tools, bins, furniture, and approved debris. The crew reviews item volume, sorting needs, access, and final pricing before loading begins.",
        heroSubtitle: "Clear clutter, boxes, bins, shelving, lawn equipment, and bulky items from the garage.",
        serviceIntro: "Garage cleanout pages should connect with customers who want a more usable garage but do not want to sort and haul every item themselves. This page covers common garage junk, move-out cleanups, pricing factors, and preparation.",
        items: [
            { title: "Boxes & Storage Bins", desc: "Old boxes, bins, holiday storage, household overflow, and miscellaneous clutter." },
            { title: "Shelving & Cabinets", desc: "Metal shelves, wood shelving, cabinets, workbenches, and storage systems." },
            { title: "Tools & Equipment", desc: "Broken tools, small equipment, hardware, and garage work area debris." },
            { title: "Lawn Equipment", desc: "Mowers, trimmers, garden tools, hoses, planters, and outdoor equipment." },
            { title: "Furniture & Bulky Items", desc: "Old furniture, exercise equipment, rugs, mattresses, and large household items." },
            { title: "Auto & Hobby Items", desc: "Approved tires, wheels, sports gear, hobby supplies, and garage clutter after review." },
        ],
        useCases: [
            { title: "Decluttering a garage", desc: "Remove piles, old storage, and bulky items to make the space usable again." },
            { title: "Move-out garage cleanup", desc: "Clear leftover items before selling, moving, or turning over a rental." },
            { title: "Project debris removal", desc: "Haul approved garage debris after a home project, hobby cleanup, or storage reset." },
        ],
        audience: [
            { title: "Homeowners", desc: "For garage junk removal, decluttering, and bulky item pickup." },
            { title: "Renters", desc: "For clearing a garage or storage area before moving out." },
            { title: "Landlords and realtors", desc: "For removing leftover garage items before turnover or listing." },
        ],
        pricingFactors: [
            "Garage size and item volume",
            "Sorting needs and items to keep",
            "Heavy, dense, or restricted materials",
            "Truck access, driveway space, and carry distance",
        ],
        preparationTips: [
            "Mark or separate items that should stay.",
            "Group small loose items in boxes or bags where possible.",
            "Mention heavy materials, chemicals, tires, or restricted items before booking.",
        ],
        procesSteps: [
            { title: "Identify what goes", desc: "Walk the garage and separate or mark items that should be removed." },
            { title: "Confirm the quote", desc: "The crew reviews the volume, access, and final price before loading." },
            { title: "Clear approved items", desc: "Approved garage items are loaded and hauled away." },
        ],
        faqs: [
            { q: "How long does a garage cleanout take?", a: "Timing depends on garage size, item volume, sorting needs, access, and safety conditions. The crew confirms the plan before loading begins." },
            { q: "Can I keep some items?", a: "Yes. Clearly separate or mark anything that should stay before work begins." },
            { q: "Do you remove old shelves and cabinets?", a: "Shelving, cabinets, and workbenches can often be removed when access, attachment, and scope are reviewed first." },
        ],
    },
    {
        slug: "hot-tub-removal",
        title: "Hot Tub Removal",
        names: ["Hot Tub Removal", "Hot Tub", "hot-tub-removal"],
        keywordSynonyms: ["hot tub disposal", "spa removal", "hot tub haul away", "jacuzzi removal"],
        icon: "Bath",
        shortDesc: "Hot tub removal and spa removal with dismantling, loading, and haul-away after access review.",
        fullDesc: "Hot tub removal often requires draining, utility preparation, dismantling, and heavy hauling. The crew reviews size, material, access, deck placement, and disconnection status before work begins.",
        heroSubtitle: "Remove an old hot tub, spa, cover, or surround with access, dismantling, and haul-away scoped first.",
        serviceIntro: "Hot tub removal is a specialized high-intent page because customers need to understand access, dismantling, electrical disconnection, and cost factors. This page covers the process without promising utility work that should be completed by a qualified professional.",
        items: [
            { title: "Acrylic Hot Tubs", desc: "Residential acrylic hot tubs after size, location, and access are reviewed." },
            { title: "Wooden Hot Tubs", desc: "Wood hot tubs and related material after condition and dismantling needs are clear." },
            { title: "Swim Spas", desc: "Larger spa units when access, weight, and dismantling scope are reviewed first." },
            { title: "Inflatable Spas", desc: "Deflated spas, covers, pumps, and related accessories." },
            { title: "Hot Tub Covers", desc: "Waterlogged or damaged covers removed with the main hot tub or separately." },
            { title: "Surrounds & Steps", desc: "Decking, panels, stairs, and surrounds when included in the approved scope." },
        ],
        useCases: [
            { title: "Broken hot tub removal", desc: "Remove an old or non-working spa that is no longer worth repairing." },
            { title: "Backyard renovation", desc: "Clear a hot tub before replacing a deck, patio, or outdoor layout." },
            { title: "Property cleanup", desc: "Remove a spa, cover, and related debris from a rental, sale, or estate cleanout." },
        ],
        audience: [
            { title: "Homeowners", desc: "For hot tub disposal, spa removal, and backyard cleanup." },
            { title: "Property managers", desc: "For removing unwanted hot tubs from rentals or managed properties." },
            { title: "Realtors and investors", desc: "For property prep before listing, repair, or renovation." },
        ],
        pricingFactors: [
            "Hot tub size, material, and weight",
            "Whether dismantling or cutting is required",
            "Deck, yard, gate, or backyard access",
            "Disconnection status and hauling distance",
        ],
        preparationTips: [
            "Drain the hot tub before removal.",
            "Have electrical connections disconnected by a qualified professional before pickup.",
            "Enter the hot tub size, access path, gates, and deck placement notes.",
        ],
        procesSteps: [
            { title: "Review size and access", desc: "Enter hot tub size, location, disconnection status, and access details." },
            { title: "Confirm dismantling scope", desc: "The crew confirms the final price and removal plan before work begins." },
            { title: "Break down and haul", desc: "Approved components are dismantled as quoted, loaded, and hauled away." },
        ],
        faqs: [
            { q: "Do you remove hot tubs and spas?", a: "Yes. Hot tub removal and spa removal may be available after size, access, disconnection status, and dismantling needs are reviewed." },
            { q: "Do you disconnect electrical service?", a: "Electrical disconnection should be completed by a qualified professional before the appointment." },
            { q: "What affects hot tub removal cost?", a: "Cost depends on size, access, weight, whether dismantling is required, and how far pieces must be carried to the truck." },
        ],
    },
    {
        slug: "commercial-cleanout",
        title: "Commercial Cleanout",
        names: ["Commercial Cleanout", "Commercial", "Office Furniture", "Office", "commercial-cleanout"],
        keywordSynonyms: ["office cleanout", "commercial junk removal", "business cleanout", "office furniture removal"],
        icon: "Building2",
        shortDesc: "Commercial cleanout service for office furniture, retail fixtures, storage areas, and business junk.",
        fullDesc: "Commercial cleanouts are scoped around business access, item volume, building rules, scheduling windows, and billing needs. The crew confirms the cleanout plan and final price before loading begins.",
        heroSubtitle: "Clear office furniture, retail fixtures, storage areas, and business junk with commercial cleanout service.",
        serviceIntro: "The commercial cleanout service page targets office cleanout, business cleanout, and commercial junk removal intent at the service level. It should explain what can be removed, who uses the service, how scheduling works, and how pricing is confirmed.",
        items: [
            { title: "Office Furniture", desc: "Desks, office chairs, cubicles, conference tables, shelves, and filing cabinets." },
            { title: "Filing & Storage", desc: "Storage cabinets, files, shelving, racks, and backroom contents." },
            { title: "IT & Office Equipment", desc: "Approved computers, monitors, printers, networking equipment, and workstations." },
            { title: "Warehouse Items", desc: "Pallets, racking, stored goods, and warehouse junk after scope review." },
            { title: "Retail Fixtures", desc: "Displays, shelving, signage, counters, seating, and backroom material." },
            { title: "Restaurant & Facility Items", desc: "Seating, fixtures, breakroom items, and approved facility junk." },
        ],
        useCases: [
            { title: "Office cleanout", desc: "Remove office furniture, files, storage, electronics, and workspace junk." },
            { title: "Business relocation", desc: "Clear unwanted items before a move, downsizing, or lease turnover." },
            { title: "Retail or warehouse cleanup", desc: "Remove fixtures, shelving, stored goods, pallets, and approved debris." },
        ],
        audience: [
            { title: "Office managers", desc: "For office furniture removal and workspace cleanouts." },
            { title: "Property managers", desc: "For commercial tenant turnover, storage-area cleanup, and multi-location cleanouts." },
            { title: "Contractors and facility teams", desc: "For approved debris pickup and business cleanout support." },
        ],
        pricingFactors: [
            "Item volume and number of loads",
            "Building access, elevators, loading docks, and parking",
            "After-hours, weekend, or restricted access requirements",
            "Sorting, staging, billing, or recurring service needs",
        ],
        preparationTips: [
            "Confirm building access, loading dock rules, and parking instructions.",
            "Separate confidential documents or equipment that should not be hauled.",
            "Enter load details, access notes, and scheduling needs before booking.",
        ],
        procesSteps: [
            { title: "Scope the business cleanout", desc: "Enter load details, building access, and scheduling needs." },
            { title: "Confirm quote and timing", desc: "The crew confirms the final price, access plan, and approved scope before loading." },
            { title: "Remove commercial junk", desc: "Approved business junk is loaded, hauled, and routed appropriately." },
        ],
        faqs: [
            { q: "Do you offer office cleanout service?", a: "Yes. Office cleanout service can include desks, chairs, cubicles, filing cabinets, electronics, and workspace junk after scope review." },
            { q: "Can property managers schedule commercial cleanouts?", a: "Yes. Property managers can request commercial cleanouts for tenant turnover, storage areas, bulk items, and managed properties." },
            { q: "Can you work around building access rules?", a: "Share elevator, loading dock, parking, floor access, and time-window requirements before booking so the job can be planned correctly." },
        ],
    },
    {
        slug: "storage-unit-cleanout",
        title: "Storage Unit Cleanout",
        names: ["Storage Unit Cleanout", "Storage Unit", "Storage", "storage-unit-cleanout"],
        keywordSynonyms: ["storage cleanout", "storage unit junk removal", "storage locker cleanout"],
        icon: "Package",
        shortDesc: "Storage unit cleanout service for boxes, furniture, household goods, and leftover storage items.",
        fullDesc: "Storage unit cleanouts are planned around unit size, item volume, facility access, gate codes, elevator use, and checkout requirements. The crew confirms access and final pricing before loading.",
        heroSubtitle: "Clear a storage unit, locker, or storage room with hauling for approved furniture, boxes, and junk.",
        serviceIntro: "Storage unit cleanout content should help customers understand how access and facility rules affect the appointment. This page targets storage cleanout, storage unit junk removal, and storage locker cleanout intent.",
        items: [
            { title: "Small Units", desc: "Boxes, bins, small furniture, decor, and household overflow from lockers and small units." },
            { title: "Medium Units", desc: "Room-sized storage units with furniture, appliances, and mixed household goods." },
            { title: "Large Units", desc: "Garage-sized units with bulky furniture, equipment, boxes, and stored items." },
            { title: "Indoor Units", desc: "Climate-controlled or interior units after elevator and hallway access are reviewed." },
            { title: "Drive-Up Units", desc: "Outdoor units where loading conditions and facility access are confirmed." },
            { title: "Multiple Units", desc: "Several units or larger cleanouts after scope and scheduling are reviewed." },
        ],
        useCases: [
            { title: "Stop paying for unused storage", desc: "Clear items you no longer need so the unit can be closed out." },
            { title: "Move-out storage cleanout", desc: "Remove leftover items from a storage locker before a deadline." },
            { title: "Estate or property storage", desc: "Clear stored belongings after sorting decisions have been made." },
        ],
        audience: [
            { title: "Storage renters", desc: "For storage unit junk removal and locker cleanouts." },
            { title: "Families and estate coordinators", desc: "For stored household items, furniture, and boxes." },
            { title: "Facility managers", desc: "For abandoned or approved unit cleanouts after access rules are clear." },
        ],
        pricingFactors: [
            "Unit size and item volume",
            "Indoor, elevator, or drive-up access",
            "Facility rules and access requirements",
            "Heavy items, sorting needs, and truck load count",
        ],
        preparationTips: [
            "Confirm facility access rules before the appointment.",
            "Separate items that should stay before loading begins.",
            "Bring or provide any gate code, unit number, lock access, and checkout instructions.",
        ],
        procesSteps: [
            { title: "Share unit details", desc: "Provide the unit size, facility access, item types, and whether anything should stay." },
            { title: "Confirm access and price", desc: "The crew reviews facility rules, item volume, and final pricing before loading." },
            { title: "Clear approved items", desc: "Approved storage items are removed and hauled away." },
        ],
        faqs: [
            { q: "Do I need to be there for a storage unit cleanout?", a: "Facility rules vary. Confirm access requirements with the storage facility and provide any required gate, lock, or unit instructions." },
            { q: "Can I keep some things in the unit?", a: "Yes. Separate or mark items that should stay before loading begins." },
            { q: "Do you sweep the unit after removal?", a: "Basic cleanup around the loaded area may be available, but facility checkout requirements should be confirmed with the property manager." },
        ],
    },
    {
        slug: "hoarder-cleanout",
        title: "Hoarder Cleanout",
        names: ["Hoarder Cleanout", "Hoarder", "Hoarding", "hoarder-cleanout"],
        keywordSynonyms: ["hoarding cleanout", "clutter cleanout", "home cleanout help"],
        icon: "Container",
        shortDesc: "Sensitive clutter and hoarding cleanout support with scope, access, privacy, and safety reviewed first.",
        fullDesc: "Hoarding and heavy clutter cleanouts require careful planning. The crew reviews privacy needs, access, sorting requests, unsafe conditions, and item volume before confirming the cleanout plan.",
        heroSubtitle: "Plan a clutter or hoarding cleanout with clear scope, privacy needs, and item-handling details reviewed first.",
        serviceIntro: "Hoarder cleanout content must be careful and factual. This page explains clutter removal, phased cleanout planning, privacy considerations, and safety limitations without implying specialist remediation services.",
        items: [
            { title: "Room-by-Room Clutter", desc: "Approved household clutter, boxes, furniture, and unwanted items from rooms." },
            { title: "Storage Areas", desc: "Garages, basements, closets, attics, and storage spaces after access review." },
            { title: "Furniture & Household Items", desc: "Bulky items, general junk, and approved contents from the cleanout." },
            { title: "Bagged or Boxed Items", desc: "Prepared items, bags, boxes, and sorted removal piles." },
            { title: "Donation-Eligible Items", desc: "Usable items can be set aside when local donation options accept them." },
            { title: "Phased Cleanout Work", desc: "Larger jobs can be discussed as multiple visits when the scope requires it." },
        ],
        useCases: [
            { title: "Clutter cleanout", desc: "Remove unwanted items from rooms, storage areas, garages, and living spaces." },
            { title: "Family-assisted cleanup", desc: "Support a cleanup after family members have identified what should stay or go." },
            { title: "Phased property cleanout", desc: "Plan larger cleanouts by room, area, or priority when one visit is not enough." },
        ],
        audience: [
            { title: "Families and homeowners", desc: "For private clutter cleanouts with clear item decisions and pacing needs." },
            { title: "Property managers", desc: "For approved property cleanup after safety conditions and access are reviewed." },
            { title: "Estate or support coordinators", desc: "For larger cleanouts where privacy, sorting, and communication matter." },
        ],
        pricingFactors: [
            "Item volume and number of rooms",
            "Sorting, bagging, or staging needs",
            "Access, stairs, parking, and loading conditions",
            "Unsafe, restricted, or specialist-material concerns",
        ],
        preparationTips: [
            "Set aside valuables, documents, medications, and keepsakes before loading.",
            "Share privacy, pacing, and sorting needs before booking.",
            "Describe unsafe conditions or restricted materials so the right next step can be confirmed.",
        ],
        procesSteps: [
            { title: "Discuss the scope privately", desc: "Share room count, item volume, privacy needs, and any conditions that affect the job." },
            { title: "Confirm the cleanout plan", desc: "The crew reviews scope, access, safety, and final price before work begins." },
            { title: "Remove approved items", desc: "Approved items are loaded and hauled according to the agreed plan." },
        ],
        faqs: [
            { q: "Is hoarder cleanout service private?", a: "Privacy needs can be discussed before booking so scheduling, access, and communication are handled appropriately." },
            { q: "Do you provide specialist remediation?", a: "No specialist remediation is implied. Unsafe or regulated material may require a qualified specialist before junk removal can proceed." },
            { q: "Can the cleanout be done in phases?", a: "Larger or sensitive cleanouts can be discussed as phased work when the scope requires more than one visit." },
        ],
    },
    {
        slug: "foreclosure-cleanout",
        title: "Foreclosure Cleanout",
        names: ["Foreclosure Cleanout", "Foreclosure", "REO Cleanout", "foreclosure-cleanout"],
        keywordSynonyms: ["reo cleanout", "foreclosure junk removal", "property cleanout"],
        icon: "KeyRound",
        shortDesc: "Foreclosure and REO cleanout service for approved contents, trash, debris, appliances, and exterior junk.",
        fullDesc: "Foreclosure and REO cleanouts are scoped by property size, item volume, access, safety conditions, and any required sorting or cleanup needs. The crew confirms the plan and final price before loading.",
        heroSubtitle: "Clear approved contents, debris, appliances, and leftover items from foreclosure or REO properties.",
        serviceIntro: "Foreclosure cleanout pages should target REO cleanout and property cleanout intent without overpromising speed or legal capability. This page explains what can be removed, who uses the service, and which factors affect cost.",
        items: [
            { title: "Interior Contents", desc: "Furniture, boxes, trash, household items, and approved contents left inside." },
            { title: "Exterior Debris", desc: "Loose exterior junk, yard debris, and approved outdoor material." },
            { title: "Appliance Removal", desc: "Non-working or unwanted appliances after disconnection and access are reviewed." },
            { title: "Garage & Storage Areas", desc: "Garages, sheds, closets, and storage spaces with approved items." },
            { title: "Trash & Debris", desc: "Bagged trash, loose debris, and cleanout material that is accepted for hauling." },
            { title: "Listing Prep Support", desc: "Removal of approved junk before repairs, sale prep, or turnover steps." },
        ],
        useCases: [
            { title: "REO cleanout", desc: "Clear approved contents from a property after access and scope are confirmed." },
            { title: "Property turnover", desc: "Remove leftover items before repairs, inspection, sale prep, or listing." },
            { title: "Exterior cleanup", desc: "Haul approved exterior debris, old items, and garage clutter." },
        ],
        audience: [
            { title: "Banks and REO contacts", desc: "For approved property cleanouts after access authority is clear." },
            { title: "Property managers", desc: "For rental, foreclosure, and vacant property cleanup." },
            { title: "Realtors and investors", desc: "For removing unwanted items before repairs, staging, or listing." },
        ],
        pricingFactors: [
            "Property size and item volume",
            "Interior versus exterior debris",
            "Access, parking, utilities, and safety conditions",
            "Number of loads and any sorting requirements",
        ],
        preparationTips: [
            "Confirm legal access and authorization before scheduling.",
            "Identify restricted materials, utilities, or unsafe areas before the appointment.",
            "Enter lockbox details, load details, and scope notes where appropriate.",
        ],
        procesSteps: [
            { title: "Review property access", desc: "Share authorization, access details, item volume, and property conditions." },
            { title: "Confirm scope and quote", desc: "The crew reviews what can be removed and confirms final pricing before loading." },
            { title: "Clear approved items", desc: "Approved contents and debris are removed according to the agreed scope." },
        ],
        faqs: [
            { q: "Do you offer foreclosure cleanout service?", a: "Yes. Foreclosure cleanout service can include approved contents, trash, appliances, garage items, and exterior debris after scope and access are reviewed." },
            { q: "Can you handle occupied properties?", a: "No. This service is for properties where authorized access and removal scope are clear. It is not an eviction service." },
            { q: "How is foreclosure cleanout pricing calculated?", a: "Pricing depends on property size, item volume, access, safety conditions, sorting needs, and number of loads." },
        ],
    },
];

/** Convert a display name to a URL slug */
export function nameToSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

/** Get the services the client selected (matched against the master catalog) */
export function getClientServices(services: readonly string[] = siteConfig.services): ServiceDetail[] {
    const selected = services;
    const matchedServices = ALL_SERVICES.filter((svc) =>
        svc.names.some((n) =>
            selected.some(
                (s) => s.toLowerCase() === n.toLowerCase() || nameToSlug(s) === svc.slug
            )
        )
    );
    const coreJunkRemoval = ALL_SERVICES.find((svc) => svc.slug === "junk-removal");
    if (!coreJunkRemoval) return matchedServices;

    return [
        coreJunkRemoval,
        ...matchedServices.filter((svc) => svc.slug !== coreJunkRemoval.slug),
    ];
}

/** Get a service by its URL slug */
export function getServiceBySlug(slug: string): ServiceDetail | undefined {
    return ALL_SERVICES.find((svc) => svc.slug === slug);
}

export function getServiceSynonyms(service: ServiceDetail): string[] {
    if (service.keywordSynonyms && service.keywordSynonyms.length > 0) {
        return service.keywordSynonyms;
    }

    return [
        `${service.title.toLowerCase()} pickup`,
        `${service.title.toLowerCase()} disposal`,
        `${service.title.toLowerCase()} hauling`,
    ];
}
