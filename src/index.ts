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
    (application: CharacterSheetPF2e<CharacterPF2e>, _html: JQuery, _data: CharacterSheetData) => {
        const classFeats = application.actor.feats.get("class");
        const bonusClassFeats = application.actor.feats.get("bonusClassFeats");

        if (classFeats && bonusClassFeats) {
            bonusClassFeats.filter.traits = [];

            for (const trait of classFeats.filter.traits ?? []) {
                bonusClassFeats.filter.traits.push(trait);
            }
        }
    },
);
