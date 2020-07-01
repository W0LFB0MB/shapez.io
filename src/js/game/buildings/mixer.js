import { formatItemsPerSecond } from "../../core/utils";
import { enumDirection, Vector } from "../../core/vector";
import { T } from "../../translations";
import { enumItemType } from "../base_item";
import { ItemAcceptorComponent } from "../components/item_acceptor";
import { ItemEjectorComponent } from "../components/item_ejector";
import { enumItemProcessorTypes, ItemProcessorComponent } from "../components/item_processor";
import { Entity } from "../entity";
import { MetaBuilding, defaultBuildingVariant } from "../meta_building";
import { GameRoot, enumLayer } from "../root";
import { enumHubGoalRewards } from "../tutorial_goals";

/** @enum {string} */
export const enumMixerVariants = { inverse: "inverse" };

export class MetaMixerBuilding extends MetaBuilding {
    constructor() {
        super("mixer");
    }

    getDimensions(variant) {
        switch (variant) {
            case defaultBuildingVariant:
            case enumMixerVariants.inverse:
                return new Vector(2, 1);
            default:
                assertAlways(false, "Unknown splitter variant: " + variant);
        }
    }


    getSilhouetteColor() {
        return "#cdbb7d";
    }

    getAvailableVariants(root) {
        if (root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_mixer)) {
            return [
                defaultBuildingVariant,
                enumMixerVariants.inverse,
            ];
        }
        return super.getAvailableVariants(root);
    }

    /**
     * @param {GameRoot} root
     */
    getIsUnlocked(root) {
        return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_mixer);
    }

    /**
     * @param {GameRoot} root
     * @param {string} variant
     * @returns {Array<[string, string]>}
     */
    getAdditionalStatistics(root, variant) {
        const speed = root.hubGoals.getProcessorBaseSpeed(enumItemProcessorTypes.mixer);
        return [[T.ingame.buildingPlacement.infoTexts.speed, formatItemsPerSecond(speed)]];
    }

    /**
     * Creates the entity at the given location
     * @param {Entity} entity
     */
    setupEntityComponents(entity) {
        entity.addComponent(
            new ItemProcessorComponent({
                inputsPerCharge: 2,
                processorType: enumItemProcessorTypes.mixer,
            })
        );

        entity.addComponent(
            new ItemEjectorComponent({
                slots: [{ pos: new Vector(0, 0), direction: enumDirection.top }],
            })
        );
        entity.addComponent(
            new ItemAcceptorComponent({
                slots: [
                    {
                        pos: new Vector(0, 0),
                        directions: [enumDirection.bottom],
                        filter: enumItemType.color,
                    },
                    {
                        pos: new Vector(1, 0),
                        directions: [enumDirection.bottom],
                        filter: enumItemType.color,
                    },
                ],
            })
        );
        }

    /**
     *
     * @param {Entity} entity
     * @param {number} rotationVariant
     * @param {string} variant
     */
    updateVariants(entity, rotationVariant, variant) {
        switch (variant) {
            case defaultBuildingVariant: {
                entity.components.ItemAcceptor.setSlots([
                    {
                        pos: new Vector(0, 0),
                        directions: [enumDirection.bottom],
                        filter: enumItemType.color,
                    },
                    {
                        pos: new Vector(1, 0),
                        directions: [enumDirection.bottom],
                        filter: enumItemType.color,
                    },
                ]);

                entity.components.ItemEjector.setSlots([
                    { pos: new Vector(1, 0), direction: enumDirection.top },
                ]);

                entity.components.ItemProcessor.inputsPerCharge = 2;

                entity.components.ItemProcessor.type = enumItemProcessorTypes.mixer;

                break;
            }
            case enumMixerVariants.inverse: {
                entity.components.ItemAcceptor.setSlots([
                    {
                        pos: new Vector(0, 0),
                        directions: [enumDirection.bottom],
                        filter: enumItemType.color,
                    },
                    {
                        pos: new Vector(1, 0),
                        directions: [enumDirection.bottom],
                        filter: enumItemType.color,
                    },
                ]);

                entity.components.ItemEjector.setSlots([
                    { pos: new Vector(0, 0), direction: enumDirection.top },
                    { pos: new Vector(1, 0), direction: enumDirection.top },
                ]);

                entity.components.ItemProcessor.inputsPerCharge = 2;

                entity.components.ItemProcessor.type = enumItemProcessorTypes.mixer;

                break;
            }
            default:
                assertAlways(false, "Unknown painter variant: " + variant);
        }
    }
}
