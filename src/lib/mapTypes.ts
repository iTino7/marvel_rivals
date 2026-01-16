import * as z from "zod";

export const DescriptionMapSchema = z.object({
    "id": z.number(),
    "name": z.string(),
    "full_name": z.string(),
    "location": z.string(),
    "description": z.string(),
    "game_mode": z.string(),
    "is_competitive": z.boolean(),
    "sub_map_id": z.number(),
    "sub_map_name": z.null(),
    "sub_map_thumbnail": z.null(),
    "images": z.array(z.string()),
    "video": z.string(),
});
export type DescriptionMap = z.infer<typeof DescriptionMapSchema>;
