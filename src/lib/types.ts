import * as z from "zod";

export const TypeSchema = z.enum([
    "Movement",
    "Normal",
    "Passive",
    "Ultimate",
    "Weapon",
]);
export type Type = z.infer<typeof TypeSchema>;


export const AttackTypeSchema = z.enum([
    "Hitscan Heroes",
    "Melee Heroes",
    "Projectile",
    "Projectile Heroes",
]);
export type AttackType = z.infer<typeof AttackTypeSchema>;


export const QualitySchema = z.enum([
    "BLUE",
    "NO_QUALITY",
    "ORANGE",
    "PURPLE",
]);
export type Quality = z.infer<typeof QualitySchema>;


export const RoleSchema = z.enum([
    "Duelist",
    "Strategist",
    "Vanguard",
]);
export type Role = z.infer<typeof RoleSchema>;


export const MovementSpeedSchema = z.enum([
    "6 m/s",
    "6.5 m/s",
    "6m/s",
    "7m/s",
]);
export type MovementSpeed = z.infer<typeof MovementSpeedSchema>;

export const AbilitySchema = z.object({
    "id": z.number(),
    "icon": z.string(),
    "name": z.string().optional(),
    "type": TypeSchema,
    "isCollab": z.boolean(),
    "description": z.string().optional(),
    "additional_fields": z.record(z.string(), z.string()).optional(),
    "transformation_id": z.string(),
});
export type Ability = z.infer<typeof AbilitySchema>;

export const CostumeSchema = z.object({
    "id": z.string(),
    "name": z.string(),
    "icon": z.union([z.null(), z.string()]),
    "quality": QualitySchema,
    "description": z.string(),
    "appearance": z.string(),
});
export type Costume = z.infer<typeof CostumeSchema>;

export const TransformationSchema = z.object({
    "id": z.string(),
    "name": z.string(),
    "icon": z.string(),
    "health": z.union([z.null(), z.string()]),
    "movement_speed": z.union([MovementSpeedSchema, z.null()]),
});
export type Transformation = z.infer<typeof TransformationSchema>;

export const HeroElementSchema = z.object({
    "id": z.string(),
    "name": z.string(),
    "real_name": z.string(),
    "imageUrl": z.string(),
    "icon": z.string().optional(),
    "role": RoleSchema,
    "attack_type": AttackTypeSchema,
    "team": z.array(z.string()),
    "difficulty": z.string(),
    "bio": z.string(),
    "lore": z.string(),
    "transformations": z.array(TransformationSchema),
    "costumes": z.array(CostumeSchema),
    "abilities": z.array(AbilitySchema),
});
export type HeroElement = z.infer<typeof HeroElementSchema>;

export const MapSchema = z.object({
    "id": z.number(),
    "name": z.string(),
    "full_name": z.string(),
    "location": z.string(),
    "description": z.string(),
    "game_mode": z.string(),
    "is_competitive": z.boolean(),
    "sub_map_id": z.number(),
    "sub_map_name": z.union([z.null(), z.string()]),
    "sub_map_thumbnail": z.null(),
    "images": z.array(z.string()),
    "video": z.union([z.null(), z.string()]),
});
export type Map = z.infer<typeof MapSchema>;

export const MapsSchema = z.object({
    "total_maps": z.number(),
    "maps": z.array(MapSchema),
});
export type Maps = z.infer<typeof MapsSchema>;
