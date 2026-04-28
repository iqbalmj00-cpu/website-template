/**
 * serviceData.ts — Master catalog of all junk removal services.
 * Each client's website only renders services that match siteConfig.services.
 */

import { isSameDayEnabled, siteConfig } from "./siteConfig";

export interface ServiceDetail {
    slug: string;
    title: string;
    names: string[];          // possible siteConfig.services values that map to this service
    keywordSynonyms?: string[];
    icon: string;             // Lucide icon name
    shortDesc: string;
    fullDesc: string;
    heroSubtitle: string;
    items: { title: string; desc: string }[];
    procesSteps: { title: string; desc: string }[];
    faqs: { q: string; a: string }[];
}

export const ALL_SERVICES: ServiceDetail[] = [
    {
        slug: "junk-removal",
        title: "Junk Removal",
        names: ["Junk Removal", "General Junk Removal", "junk-removal"],
        keywordSynonyms: ["junk pickup", "junk hauling", "trash removal", "debris removal"],
        icon: "Trash2",
        shortDesc: "Full-service junk removal for homes and businesses. We haul away anything you don't want.",
        fullDesc: "From a single item to a full truckload, our crew handles the heavy lifting. Items are routed for donation, recycling, or disposal when appropriate local options are available.",
        heroSubtitle: "Point at what you want gone — we take care of the rest with clear pricing and professional hauling.",
        items: [
            { title: "Household Junk", desc: "Old furniture, boxes, bags, and miscellaneous clutter." },
            { title: "Garage & Basement", desc: "Years of accumulated items cleared in hours." },
            { title: "Renovation Debris", desc: "Post-project cleanup including drywall, lumber, and tile." },
            { title: "Appliances", desc: "Fridges, washers, dryers, and other large appliances." },
            { title: "Yard Waste", desc: "Branches, soil, old fencing, and outdoor debris." },
            { title: "Miscellaneous", desc: "If it fits in our truck, we can probably take it." },
        ],
        procesSteps: [
            { title: "Book Online", desc: "Schedule a pickup in 2 minutes — no phone tag required." },
            { title: "We Show Up", desc: "Our crew arrives on time and gives you a firm, upfront price." },
            { title: "It's Gone", desc: "We load everything, sweep up, and haul it all away." },
        ],
        faqs: [
            { q: "What items do you take?", a: "Almost everything — furniture, appliances, electronics, yard waste, and more. See our Items We Take page for the full list." },
            { q: "How much does it cost?", a: "Pricing is based on how much space your items take in our truck. We give you a firm quote before we start." },
            { q: "Do you offer same-day service?", a: isSameDayEnabled() ? "Same-day and next-day pickups may be available depending on schedule capacity." : "Availability depends on the schedule. Book online or call to see the next open pickup window." },
        ],
    },
    {
        slug: "demolition",
        title: "Demolition",
        names: ["Demolition", "Light Demolition", "Demo", "demolition"],
        keywordSynonyms: ["light demolition", "demo debris removal", "shed demolition", "tear-out removal"],
        icon: "Hammer",
        shortDesc: "Light demolition services for sheds, decks, fences, and interior tear-outs.",
        fullDesc: "We handle small to medium demolition projects including shed removal, deck tear-down, fence demolition, and interior gut-outs. All debris is hauled away in the same visit.",
        heroSubtitle: "Need something torn down? We demolish it, load it, and haul it — all in one visit.",
        items: [
            { title: "Shed Removal", desc: "Wood, metal, and plastic sheds demolished and hauled." },
            { title: "Deck Tear-Down", desc: "Wood and composite decks removed safely." },
            { title: "Fence Removal", desc: "Chain-link, wood, and vinyl fencing taken down and hauled." },
            { title: "Interior Demolition", desc: "Cabinets, countertops, drywall, and flooring removed." },
            { title: "Concrete Removal", desc: "Small pads, walkways, and steps broken up and hauled." },
            { title: "Above-Ground Pools", desc: "Pool walls, liners, and frames removed." },
        ],
        procesSteps: [
            { title: "Site Assessment", desc: "We visit the site and provide a firm quote for the work." },
            { title: "Demo Day", desc: "Our crew tears it down safely and efficiently." },
            { title: "Clean Haul", desc: "All debris is loaded and hauled away. Site left clean." },
        ],
        faqs: [
            { q: "What kind of demolition do you do?", a: "We handle light demolition — sheds, decks, fences, interior tear-outs, and small concrete. We don't do structural or load-bearing demolition." },
            { q: "Do you haul the debris too?", a: "Yes! Demo and haul-away are included in one price." },
            { q: "Do I need a permit?", a: "Permit requirements vary by city. We can advise you on what's typically needed for your project." },
        ],
    },
    {
        slug: "furniture-removal",
        title: "Furniture Removal",
        names: ["Furniture Removal", "Furniture", "furniture-removal"],
        keywordSynonyms: ["furniture pickup", "furniture disposal", "couch removal", "sofa removal", "mattress removal"],
        icon: "Armchair",
        shortDesc: "We handle heavy lifting for couches, tables, mattresses, chairs, and more.",
        fullDesc: "Our team maneuvers large items through tight hallways and stairwells with care. Bulky pieces can be disassembled when necessary, and usable or recyclable items are routed responsibly when local options are available.",
        heroSubtitle: "Don't break your back moving that old couch. We handle the heavy lifting for sofa removal, mattress disposal, and more.",
        items: [
            { title: "Sofas & Sectionals", desc: "Large sectionals, sleeper sofas, loveseats, and heavy couches." },
            { title: "Mattresses & Beds", desc: "King, Queen, Twin mattresses, box springs, bed frames." },
            { title: "Tables & Dining Sets", desc: "Dining tables, coffee tables, end tables, and heavy wooden furniture." },
            { title: "Desks & Office", desc: "Heavy desks, filing cabinets, office chairs, and cubicle partitions." },
            { title: "Bookcases & Dressers", desc: "Wardrobes, armoires, tall bookcases, chest of drawers." },
            { title: "Patio Furniture", desc: "Outdoor lounge sets, metal chairs, grills, and patio tables." },
        ],
        procesSteps: [
            { title: "Book Online", desc: "Schedule a no-obligation estimate in minutes via our website or phone." },
            { title: "We Load It", desc: "Our friendly crew arrives and does all the heavy lifting from anywhere in your home." },
            { title: "It's Gone!", desc: "We haul it away to be responsibly disposed of, donated, or recycled." },
        ],
        faqs: [
            { q: "Do you take apart large furniture?", a: "Yes! Our crew can disassemble sofas, bed frames, desks, and other bulky items at no extra charge." },
            { q: "What happens to my old furniture?", a: "Items in good condition may be routed for donation when a local option is available. Other items are taken to an appropriate disposal facility." },
            { q: "Can you remove furniture from upstairs?", a: "Absolutely. Our team is trained to safely navigate stairs, narrow hallways, and tight corners." },
        ],
    },
    {
        slug: "appliance-removal",
        title: "Appliance Removal",
        names: ["Appliance Removal", "Appliance Disposal", "Appliances", "appliance-removal"],
        keywordSynonyms: ["appliance pickup", "appliance disposal", "refrigerator removal", "washer removal", "dryer removal"],
        icon: "Plug",
        shortDesc: "Responsible disposal of fridges, washers, dryers, and ovens.",
        fullDesc: "Old appliances are heavy and may require special handling depending on the item. We review appliance type, access, and any local disposal requirements before pickup.",
        heroSubtitle: "Old appliances are heavy and awkward. Let our crew handle the lifting, loading, and hauling.",
        items: [
            { title: "Refrigerators", desc: "All sizes including commercial units. Refrigerant requirements are reviewed before pickup." },
            { title: "Washers & Dryers", desc: "Front-load, top-load, stackable units. Gas line disconnection available." },
            { title: "Ovens & Stoves", desc: "Electric and gas ranges. We handle disconnection safely." },
            { title: "Dishwashers", desc: "Built-in and portable units removed and hauled." },
            { title: "Water Heaters", desc: "Tank and tankless models. Proper disposal guaranteed." },
            { title: "A/C Units", desc: "Window units, portable units, and mini-splits." },
        ],
        procesSteps: [
            { title: "Schedule Pickup", desc: "Tell us what appliances need to go and we'll give you a price upfront." },
            { title: "Safe Removal", desc: "Our crew disconnects and removes appliances safely, protecting your floors and walls." },
            { title: "Proper Routing", desc: "Appliances are routed through appropriate local disposal or recycling channels when available." },
        ],
        faqs: [
            { q: "Do you disconnect appliances?", a: "We can disconnect standard electrical connections. For gas lines, we recommend having a plumber disconnect first." },
            { q: "Is freon removal included?", a: "Refrigerant handling requirements vary by location and appliance type. We confirm any required handling before pickup." },
            { q: "Can you remove built-in appliances?", a: "Yes, we handle built-in dishwashers, microwaves, and wall ovens." },
        ],
    },
    {
        slug: "e-waste-recycling",
        title: "E-Waste Recycling",
        names: ["E-Waste Recycling", "E-Waste", "Electronics", "e-waste-recycling"],
        keywordSynonyms: ["electronics pickup", "electronics disposal", "computer recycling", "tv removal"],
        icon: "Monitor",
        shortDesc: "Pickup and hauling for computers, monitors, printers, TVs, and other electronics.",
        fullDesc: "Electronic waste can require special routing. We collect electronics and route them through available local disposal or recycling options.",
        heroSubtitle: "Old electronics are awkward to move. We pick them up and route them through appropriate local channels.",
        items: [
            { title: "TVs & Monitors", desc: "LCD, LED, plasma, CRT — all sizes accepted." },
            { title: "Computers & Laptops", desc: "Desktops, laptops, servers, and peripherals." },
            { title: "Printers & Scanners", desc: "Inkjet, laser, commercial copiers." },
            { title: "Stereos & Speakers", desc: "Home theater systems, audio equipment." },
            { title: "Cables & Misc", desc: "Power cords, adapters, chargers, and accessories." },
            { title: "Gaming Equipment", desc: "Consoles, VR headsets, and gaming peripherals." },
        ],
        procesSteps: [
            { title: "Gather Electronics", desc: "Collect all the old electronics you want gone." },
            { title: "We Pick Up", desc: "Our team carefully collects and sorts all items." },
            { title: "Proper Routing", desc: "Electronics are routed through available local recycling or disposal options." },
        ],
        faqs: [
            { q: "Is my data safe?", a: "Remove or wipe storage devices before pickup when data privacy matters. Ask before booking if you need a specific destruction process." },
            { q: "Do you take CRT monitors and TVs?", a: "Yes, we accept all types of screens including older CRT models." },
            { q: "Is there a minimum for e-waste pickup?", a: "No minimum. We'll pick up a single monitor or an entire office of electronics." },
        ],
    },
    {
        slug: "mattress-disposal",
        title: "Mattress Disposal",
        names: ["Mattress Disposal", "Mattress Removal", "Mattresses", "mattress-disposal"],
        keywordSynonyms: ["mattress pickup", "mattress removal", "box spring disposal", "bed removal"],
        icon: "BedDouble",
        shortDesc: "We pick up mattresses and box springs of any size — king, queen, twin, and more.",
        fullDesc: "Mattresses are bulky, awkward, and often excluded from standard curbside pickup. Our crew handles the heavy lifting and routes mattresses through appropriate local options.",
        heroSubtitle: "Too big for the curb, too heavy for your car. We make mattress removal effortless.",
        items: [
            { title: "King Mattress", desc: "King and California King sizes. We navigate any stairway." },
            { title: "Queen Mattress", desc: "Standard and pillow-top queens removed with care." },
            { title: "Full & Twin Mattress", desc: "All standard sizes including bunk bed sets." },
            { title: "Box Springs", desc: "Matching box springs hauled with your mattress." },
            { title: "Bed Frames", desc: "Metal, wood, and platform frames disassembled and removed." },
            { title: "Adjustable Bases", desc: "Heavy motorized bases safely removed." },
        ],
        procesSteps: [
            { title: "Book Removal", desc: "Tell us the size and location of your mattress." },
            { title: "We Carry It Out", desc: "Our crew navigates stairs and tight spaces — you don't lift a finger." },
            { title: "Haul Away", desc: "The mattress is loaded and routed through available local disposal or recycling options." },
        ],
        faqs: [
            { q: "Do you take mattresses with stains?", a: "Yes, we take mattresses in any condition. Stained mattresses go to recycling rather than donation." },
            { q: "Can you remove a mattress from upstairs?", a: "Absolutely. Our team handles stairs, tight hallways, and even elevator buildings." },
            { q: "How many mattresses can you take at once?", a: "As many as you need. We do single mattresses up to full bedroom sets." },
        ],
    },
    {
        slug: "yard-waste-removal",
        title: "Yard Waste Removal",
        names: ["Yard Waste Removal", "Yard Waste", "Yard", "yard-waste-removal"],
        keywordSynonyms: ["yard debris pickup", "brush removal", "branch removal", "landscaping debris removal"],
        icon: "TreePine",
        shortDesc: "Seasonal cleanup made easy. Branches, leaves, dirt, mulch, and small trees removed.",
        fullDesc: "From storm cleanup to annual landscaping projects, organic waste piles up fast. We load and haul yard debris, then route it through local disposal or composting options when available.",
        heroSubtitle: "Storm damage? Landscaping project? We haul away branches, leaves, soil, and more.",
        items: [
            { title: "Branches & Limbs", desc: "Tree branches, trimmed limbs, and brush piles." },
            { title: "Soil & Dirt", desc: "Excess soil, fill dirt, and gravel from landscaping." },
            { title: "Leaves & Bags", desc: "Bagged leaves, grass clippings, and garden debris." },
            { title: "Stumps", desc: "Small to medium tree stumps removed and hauled." },
            { title: "Old Fencing", desc: "Wood, chain-link, and vinyl fencing removed." },
            { title: "Play Equipment", desc: "Swing sets, trampolines, and playhouses." },
        ],
        procesSteps: [
            { title: "Show Us the Pile", desc: "Point to whatever needs to go in your yard." },
            { title: "We Load Everything", desc: "Our crew shovels, rakes, and loads it all into our truck." },
            { title: "Proper Routing", desc: "Organic waste is routed through local composting or disposal options when available." },
        ],
        faqs: [
            { q: "Do you remove tree stumps?", a: "We can haul away stumps that have already been cut. For full stump grinding, we recommend a tree service first." },
            { q: "Can you take soil and rocks?", a: "Yes, we handle soil, gravel, rocks, and other heavy landscaping materials." },
            { q: "Do you clean up after storms?", a: "Absolutely. We offer priority scheduling for storm cleanup to help you get back to normal fast." },
        ],
    },
    {
        slug: "construction-debris",
        title: "Construction Debris Removal",
        names: ["Construction Debris", "Construction Debris Removal", "Construction", "construction-debris"],
        keywordSynonyms: ["construction debris pickup", "renovation debris removal", "contractor debris hauling", "demo debris removal"],
        icon: "HardHat",
        shortDesc: "Fast cleanup for renovation sites. Drywall, wood, tiles, flooring, and roofing.",
        fullDesc: "Whether you're a DIY enthusiast or a professional contractor, job site debris slows you down. We offer scheduled pickups to keep your workspace clear and compliant.",
        heroSubtitle: "Renovating? We clear drywall, lumber, tile, concrete, and all construction waste.",
        items: [
            { title: "Drywall & Sheetrock", desc: "New and demolition drywall hauled in any quantity." },
            { title: "Lumber & Wood", desc: "Framing lumber, plywood, trim, and pallets." },
            { title: "Tile & Flooring", desc: "Ceramic tile, hardwood, laminate, and vinyl." },
            { title: "Concrete & Brick", desc: "Small concrete pads, pavers, and brick piles." },
            { title: "Carpet & Padding", desc: "Rolled or cut carpet and padding from any room." },
            { title: "Roofing Materials", desc: "Shingles, underlayment, and flashing." },
        ],
        procesSteps: [
            { title: "Request a Pickup", desc: "Tell us the type and volume of debris at your site." },
            { title: "We Clear the Site", desc: "Our crew loads everything — no need to pile it yourself." },
            { title: "Proper Disposal", desc: "Materials are routed through appropriate local disposal channels." },
        ],
        faqs: [
            { q: "Do you work with contractors?", a: "Yes! We offer recurring pickup schedules and volume pricing for contractors and builders." },
            { q: "Can you take concrete and brick?", a: "Yes, we handle concrete, brick, and masonry up to reasonable weights. Very large pads may require a dumpster." },
            { q: "Do you clean up the job site?", a: "We can sweep and clean the work area after loading for an additional fee." },
        ],
    },
    {
        slug: "estate-cleanout",
        title: "Estate Cleanouts",
        names: ["Estate Cleanouts", "Estate Cleanout", "Estate", "estate-cleanout"],
        keywordSynonyms: ["estate cleanout service", "house cleanout", "property cleanout", "full home cleanout"],
        icon: "Home",
        shortDesc: "Total property cleanouts for garages, attics, basements, and estates.",
        fullDesc: "Dealing with a hoard or an estate cleanout can be emotional and overwhelming. Our compassionate team handles these large-scale jobs with discretion and efficiency.",
        heroSubtitle: "Full property cleanouts handled with care. We sort as requested, load, and haul unwanted items.",
        items: [
            { title: "Full Home Cleanouts", desc: "Every room cleared — bedrooms, living areas, kitchen, garage." },
            { title: "Garage & Attic", desc: "Decades of accumulated items cleared in hours." },
            { title: "Basement Cleanouts", desc: "Even flooded or cluttered basements handled professionally." },
            { title: "Storage Units", desc: "Any size storage unit cleared and swept." },
            { title: "Hoarding Situations", desc: "Compassionate, non-judgmental cleanout services." },
            { title: "Move-Out Cleanouts", desc: "Property cleared and ready for new tenants or listing." },
        ],
        procesSteps: [
            { title: "Walk-Through", desc: "We tour the property and give you a firm, upfront price." },
            { title: "Sort & Remove", desc: "We separate items by destination and haul away what needs to go." },
            { title: "Property Ready", desc: "Space is cleared, swept, and ready for its next chapter." },
        ],
        faqs: [
            { q: "How long does an estate cleanout take?", a: "Most single-family homes are completed in 1-2 days. Larger properties may take longer." },
            { q: "Do you handle hoarding situations?", a: "Yes. Our crews are trained to work with patience and discretion in hoarding situations." },
            { q: "Can you separate items for donation?", a: "We can set aside items you want donated when a local donation option accepts them." },
        ],
    },
    {
        slug: "garage-cleanout",
        title: "Garage Cleanout",
        names: ["Garage Cleanouts", "Garage Cleanout", "Garage", "garage-cleanout"],
        keywordSynonyms: ["garage junk removal", "garage cleanup", "garage cleanout service", "garage debris removal"],
        icon: "Warehouse",
        shortDesc: "Can't park in your garage anymore? We clear decades of accumulated clutter.",
        fullDesc: "Over the years, tools, decorations, and forgotten boxes pile up. Our crew removes everything you point to and routes usable or recyclable items responsibly when local options are available.",
        heroSubtitle: "Reclaim your garage. We clear the clutter so you can actually park your car again.",
        items: [
            { title: "Old Tools & Equipment", desc: "Broken tools, rusted equipment, and workbenches." },
            { title: "Storage & Boxes", desc: "Unneeded boxes, bins, holiday decorations." },
            { title: "Shelving Units", desc: "Metal and wood shelving removed and hauled." },
            { title: "Lawn Equipment", desc: "Old mowers, trimmers, and garden tools." },
            { title: "Tires & Auto Parts", desc: "Old tires, wheels, and miscellaneous car parts." },
            { title: "Sports Equipment", desc: "Bikes, exercise machines, old sports gear." },
        ],
        procesSteps: [
            { title: "Point & Go", desc: "Walk through your garage and point to what stays and what goes." },
            { title: "We Clear It Out", desc: "Our crew loads everything into our truck quickly and carefully." },
            { title: "Garage Restored", desc: "Your garage is clear, swept, and usable again." },
        ],
        faqs: [
            { q: "How long does a garage cleanout take?", a: "Most single-car garages are done in 1-2 hours. Double garages typically 2-3 hours." },
            { q: "Do you sweep up after?", a: "Yes! We leave your garage clean and ready to use." },
            { q: "Can I keep some things?", a: "Of course. Just tell us what stays and we'll work around it." },
        ],
    },
    {
        slug: "hot-tub-removal",
        title: "Hot Tub Removal",
        names: ["Hot Tub Removal", "Hot Tub", "hot-tub-removal"],
        keywordSynonyms: ["hot tub disposal", "spa removal", "hot tub pickup", "jacuzzi removal"],
        icon: "Bath",
        shortDesc: "We safely disconnect, disassemble, and haul away your old hot tub or spa.",
        fullDesc: "Our crew can handle draining, disassembly, loading, and hauling. Acrylic, wood, and metal components are routed through local disposal or recycling options when available.",
        heroSubtitle: "That old hot tub isn't going to move itself. We handle the whole process start to finish.",
        items: [
            { title: "Acrylic Hot Tubs", desc: "Standard residential hot tubs in any condition." },
            { title: "Wooden Hot Tubs", desc: "Cedar, redwood, and custom wooden tubs." },
            { title: "Swim Spas", desc: "Larger swim spa units disassembled on-site." },
            { title: "Inflatable Spas", desc: "Deflated, drained, and hauled." },
            { title: "Hot Tub Covers", desc: "Old, waterlogged covers removed." },
            { title: "Decking & Surrounds", desc: "Deck boards around the hot tub removed if needed." },
        ],
        procesSteps: [
            { title: "Assessment", desc: "We inspect the hot tub and provide a firm quote." },
            { title: "Disconnect & Drain", desc: "We safely disconnect electrical and drain all water." },
            { title: "Disassemble & Haul", desc: "Cut into manageable pieces and loaded into our truck." },
        ],
        faqs: [
            { q: "Do you disconnect the electrical?", a: "We can handle standard 110V connections. For 220V hardwired connections, please have an electrician disconnect first." },
            { q: "How long does hot tub removal take?", a: "Most hot tubs are removed in 1-2 hours, including disassembly." },
            { q: "Do you remove the concrete pad too?", a: "We can remove small concrete pads. Larger pads may require additional equipment." },
        ],
    },
    {
        slug: "commercial-cleanout",
        title: "Commercial Cleanout",
        names: ["Commercial Cleanout", "Commercial", "Office Furniture", "Office", "commercial-cleanout"],
        keywordSynonyms: ["office cleanout", "commercial junk removal", "business cleanout", "office furniture removal"],
        icon: "Building2",
        shortDesc: "Cubicles, desks, chairs, filing cabinets, and full office cleanouts.",
        fullDesc: "We work evenings and weekends to minimize disruption to your business. Our crews handle cubicle systems, conference tables, and can clear entire floors.",
        heroSubtitle: "Office relocating, downsizing, or closing? We clear commercial spaces quickly and professionally.",
        items: [
            { title: "Office Furniture", desc: "Desks, chairs, cubicles, and conference tables." },
            { title: "Filing & Storage", desc: "Filing cabinets, shelving, and storage systems." },
            { title: "IT Equipment", desc: "Servers, networking equipment, and workstations." },
            { title: "Warehouse Goods", desc: "Pallets, racking, and stored inventory." },
            { title: "Retail Fixtures", desc: "Display cases, signage, and shelving." },
            { title: "Restaurant Equipment", desc: "Commercial kitchen equipment and seating." },
        ],
        procesSteps: [
            { title: "Site Visit", desc: "We visit your space, assess the scope, and provide a firm quote." },
            { title: "Scheduled Removal", desc: "We work on your schedule — evenings and weekends available." },
            { title: "Space Ready", desc: "Your commercial space is cleared and ready for its next use." },
        ],
        faqs: [
            { q: "Can you work outside business hours?", a: "Yes! We regularly do evening and weekend cleanouts to avoid disrupting your operations." },
            { q: "Do you offer recurring service?", a: "Yes. We provide scheduled pickups for ongoing renovation or construction projects." },
            { q: "Can you handle multi-story buildings?", a: "Absolutely. Our crew is experienced with elevator logistics, loading docks, and multi-floor clearings." },
        ],
    },
    {
        slug: "storage-unit-cleanout",
        title: "Storage Unit Cleanout",
        names: ["Storage Unit Cleanout", "Storage Unit", "Storage", "storage-unit-cleanout"],
        keywordSynonyms: ["storage cleanout", "storage unit junk removal", "storage locker cleanout"],
        icon: "Package",
        shortDesc: "Stop paying rent on stuff you don't need. We clear units of any size.",
        fullDesc: "We handle units from 5x5 lockers to 10x30 warehouse-style units. Everything you want removed is loaded into our truck and routed by item type.",
        heroSubtitle: "Stop paying monthly rent on junk. We clear your storage unit fast so you can cancel.",
        items: [
            { title: "Small Units (5x5 – 5x10)", desc: "Lockers and small units with boxes and miscellaneous items." },
            { title: "Medium Units (10x10 – 10x15)", desc: "Room-sized units with furniture and household goods." },
            { title: "Large Units (10x20 – 10x30)", desc: "Garage-sized units with heavy items and equipment." },
            { title: "Climate Controlled", desc: "Indoor facility units with delicate items." },
            { title: "Outdoor / Drive-Up", desc: "Easy-access ground-level units." },
            { title: "Multiple Units", desc: "Volume pricing for clearing several units at once." },
        ],
        procesSteps: [
            { title: "Tell Us the Size", desc: "Share the unit size and location — we'll quote it remotely." },
            { title: "We Clear It", desc: "Our crew meets you (or goes alone) and loads everything." },
            { title: "Cancel Your Lease", desc: "Unit swept clean — you're free to stop paying rent." },
        ],
        faqs: [
            { q: "Do I need to be there?", a: "Not necessarily. If the facility allows, we can meet the manager and handle everything." },
            { q: "What if I want to keep some things?", a: "No problem. We'll sort through with you and only take what you want gone." },
            { q: "Do you sweep the unit after?", a: "Yes, we leave it broom-clean so you pass the facility's checkout inspection." },
        ],
    },
    {
        slug: "hoarder-cleanout",
        title: "Hoarder Cleanout",
        names: ["Hoarder Cleanout", "Hoarder", "Hoarding", "hoarder-cleanout"],
        keywordSynonyms: ["hoarding cleanout", "clutter cleanout", "home cleanout help"],
        icon: "Container",
        shortDesc: "Compassionate, non-judgmental cleanout services for hoarding situations.",
        fullDesc: "Our crews are trained to work with patience and discretion. We work at the homeowner's pace, carefully setting aside sentimental items. Our service is confidential with unmarked vehicles.",
        heroSubtitle: "No judgment, just help. We approach every hoarding cleanout with care and compassion.",
        items: [
            { title: "Full Home Clearing", desc: "Room-by-room cleanout at a comfortable pace." },
            { title: "Sentimental Sorting", desc: "We help identify and set aside meaningful items." },
            { title: "Deep Cleaning", desc: "Post-removal cleaning to restore the space." },
            { title: "Biohazard Handling", desc: "Safe handling of unsanitary conditions when needed." },
            { title: "Donation Coordination", desc: "Usable items donated to local charities." },
            { title: "Ongoing Support", desc: "Multi-day cleanouts scheduled at your pace." },
        ],
        procesSteps: [
            { title: "Private Consultation", desc: "We meet discreetly to understand the situation and your needs." },
            { title: "Respectful Removal", desc: "Our trained crew works room by room with patience." },
            { title: "Fresh Start", desc: "Space is cleared, cleaned, and ready for a new beginning." },
        ],
        faqs: [
            { q: "Is the service confidential?", a: "Completely. We use unmarked vehicles and maintain total privacy." },
            { q: "How long does it take?", a: "It depends on the severity. We can work in phases over multiple days." },
            { q: "Do you handle biohazards?", a: "Yes. Our team is trained in safe handling of unsanitary conditions." },
        ],
    },
    {
        slug: "foreclosure-cleanout",
        title: "Foreclosure Cleanout",
        names: ["Foreclosure Cleanout", "Foreclosure", "REO Cleanout", "foreclosure-cleanout"],
        keywordSynonyms: ["reo cleanout", "foreclosure junk removal", "property cleanout"],
        icon: "KeyRound",
        shortDesc: "Fast property clearing for banks, REO companies, and property managers.",
        fullDesc: "We remove all contents, sweep and clean the property, and haul everything away in a single visit. Most properties ready to list within 24 hours. Volume pricing available.",
        heroSubtitle: "We clear foreclosed properties fast and clean so they're ready to list.",
        items: [
            { title: "Full Contents Removal", desc: "Everything left behind — furniture, trash, personal items." },
            { title: "Yard Cleanup", desc: "Overgrown vegetation and exterior debris cleared." },
            { title: "Appliance Removal", desc: "Non-working appliances and fixtures removed." },
            { title: "Trash & Debris", desc: "All interior and exterior trash hauled away." },
            { title: "Sweep & Clean", desc: "Basic cleaning after removal to prepare for listing." },
            { title: "Board-Up Services", desc: "Broken windows and doors secured." },
        ],
        procesSteps: [
            { title: "Property Walk", desc: "We assess the property and provide a firm quote." },
            { title: "Total Clearance", desc: "Every room cleared, yard cleaned, appliances removed." },
            { title: "List-Ready", desc: "Property cleaned and ready for showings within 24 hours." },
        ],
        faqs: [
            { q: "Do you offer volume pricing?", a: "Yes. Property managers and REO companies get discounted rates for multiple properties." },
            { q: "Can you handle occupied properties?", a: "We only work with vacant properties. We do not perform evictions." },
            { q: "How fast can you clear a property?", a: "Most single-family homes are cleared in one day." },
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
export function getClientServices(): ServiceDetail[] {
    const selected = siteConfig.services;
    return ALL_SERVICES.filter((svc) =>
        svc.names.some((n) =>
            selected.some(
                (s) => s.toLowerCase() === n.toLowerCase() || nameToSlug(s) === svc.slug
            )
        )
    );
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
