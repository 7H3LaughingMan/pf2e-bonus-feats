import { CharacterPF2e, CharacterSheetData, CharacterSheetPF2e } from "foundry-pf2e";

Hooks.on("ready", async () => {
    const campaignFeatSections = game.settings.get("pf2e", "campaignFeatSections");

    if (!campaignFeatSections.find((section) => section.id === "bonusClassFeats")) {
        campaignFeatSections.push({
            id: "bonusClassFeats",
            label: "Bonus Class Feats",
            supported: ["class"],
            slots: [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
        });
    }

    if (!campaignFeatSections.find((section) => section.id === "bonusGeneralFeats")) {
        campaignFeatSections.push({
            id: "bonusGeneralFeats",
            label: "Bonus General Feats",
            supported: ["general", "skill"],
            slots: [1, 5, 9, 13, 17],
        });
    }

    await game.settings.set("pf2e", "campaignFeatSections", campaignFeatSections);
});

Hooks.on(
    "renderCharacterSheetPF2e",
    async (application: CharacterSheetPF2e<CharacterPF2e>, html: JQuery, _data: CharacterSheetData) => {
        const actor = application.actor;

        const classTrait = ((): string | null => {
            const slug = actor.class ? (actor.class.slug ?? game.pf2e.system.sluggify(actor.class.name)) : null;
            return slug && slug in CONFIG.PF2E.featTraits ? slug : null;
        })();

        const classFeatFilter = !classTrait
            ? []
            : actor.level < 2
              ? [`traits-${classTrait}`]
              : actor.itemTypes.feat.some((f) => f.traits.has("dedication"))
                ? [`traits-${classTrait}`, "traits-archetype"]
                : [`traits-${classTrait}`, "traits-dedication"];

        if (classFeatFilter.length === 0) {
            return;
        }

        const featsTab = $(html).find(".tab.feats");
        const bonusClassFeats = $(featsTab).find("[data-group-id='bonusClassFeats']");

        const levels = [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
        const featSlots = levels.map((level) => `bonusClassFeats-${level}`);

        $(bonusClassFeats)
            .find("button[data-type='feat']")
            .each(function () {
                const currentFilter = $(this).attr("data-filter") || "";
                $(this).attr("data-filter", currentFilter + "," + classFeatFilter.join(","));
            });

        featSlots.forEach((featSlot) => {
            const slotItem = $(bonusClassFeats).find(`[data-slot-id='${featSlot}']`);

            if (slotItem.length > 0) {
                const itemControls = slotItem.find("div.item-controls");

                itemControls.find("a").each(function () {
                    const currentFilter = $(this).attr("data-filter") || "";
                    $(this).attr("data-filter", currentFilter + "," + classFeatFilter.join(","));
                });
            }
        });
    },
);
