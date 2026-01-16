import * as z from "zod";

export const IsWinSchema = z.object({
    "score": z.number(),
    "is_win": z.boolean(),
});
export type IsWin = z.infer<typeof IsWinSchema>;

export const PlayerHeroSchema = z.object({
    "hero_id": z.number(),
    "hero_name": z.string(),
    "hero_type": z.string(),
    "kills": z.number(),
    "deaths": z.number(),
    "assists": z.number(),
    "play_time": z.number(),
    "total_hero_damage": z.number(),
    "total_damage_taken": z.number(),
    "total_hero_heal": z.number(),
});
export type PlayerHero = z.infer<typeof PlayerHeroSchema>;

export const ScoreInfoSchema = z.object({
    "add_score": z.union([z.number(), z.null()]),
    "level": z.union([z.number(), z.null()]),
    "new_level": z.union([z.number(), z.null()]),
    "new_score": z.union([z.number(), z.null()]),
});
export type ScoreInfo = z.infer<typeof ScoreInfoSchema>;

export const PaginationSchema = z.object({
    "page": z.number(),
    "limit": z.number(),
    "total_matches": z.number(),
    "total_pages": z.number(),
    "has_more": z.boolean(),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const MatchPlayerSchema = z.object({
    "assists": z.number(),
    "kills": z.number(),
    "deaths": z.number(),
    "is_win": IsWinSchema,
    "disconnected": z.boolean(),
    "player_uid": z.number(),
    "camp": z.union([z.number(), z.null()]),
    "score_info": ScoreInfoSchema,
    "player_hero": PlayerHeroSchema,
});
export type MatchPlayer = z.infer<typeof MatchPlayerSchema>;

export const MatchHistoryElementSchema = z.object({
    "match_map_id": z.number(),
    "map_thumbnail": z.string(),
    "match_play_duration": z.number(),
    "match_season": z.string(),
    "match_uid": z.string(),
    "match_winner_side": z.number(),
    "mvp_uid": z.number(),
    "svp_uid": z.number(),
    "score_info": z.union([z.record(z.string(), z.number()), z.null()]),
    "match_time_stamp": z.number(),
    "play_mode_id": z.number(),
    "game_mode_id": z.number(),
    "match_player": MatchPlayerSchema,
});
export type MatchHistoryElement = z.infer<typeof MatchHistoryElementSchema>;

export const MatchHistorySchema = z.object({
    "match_history": z.array(MatchHistoryElementSchema),
    "pagination": PaginationSchema,
});
export type MatchHistory = z.infer<typeof MatchHistorySchema>;
