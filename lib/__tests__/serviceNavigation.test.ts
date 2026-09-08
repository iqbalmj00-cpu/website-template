import assert from "assert";
import { buildServiceNavItems } from "../serviceNavigation";
const rental = { label: "Dumpster Rental", href: "/dumpster-rental" };
const config = { services: ["Furniture Removal", "Appliance Removal"], offersDumpsterRental: true };
for (const limit of [1, 5, 10, 30]) {
    const entries = buildServiceNavItems(config, limit);
    assert.deepStrictEqual(entries[entries.length - 1], rental);
    assert.ok(entries.length <= limit);
    assert.ok(!entries.some(e => e.href === "/services/dumpster-rental"));
}
assert.deepStrictEqual(buildServiceNavItems({ services: [], offersDumpsterRental: true }), [rental]);
assert.deepStrictEqual(buildServiceNavItems({ services: ["Dumpster Rental"], offersDumpsterRental: true }), [rental]);
assert.deepStrictEqual(buildServiceNavItems({ services: ["Dumpster Rental"], offersDumpsterRental: false }), []);
assert.deepStrictEqual(buildServiceNavItems({ ...config, offersDumpsterRental: false }), buildServiceNavItems(config).slice(0, -1));
assert.deepStrictEqual(buildServiceNavItems(config, 0), []);
