import * as z from "zod";

export const HeroClassSchema = z.enum([
    "Duelist",
    "Strategist",
    "Unknown",
    "Vanguard",
]);
export type HeroClass = z.infer<typeof HeroClassSchema>;

export const HeroNameSchema = z.enum([
    "invisible woman",
    "jeff the land shark",
    "mister fantastic",
    "squirrel girl",
]);
export type HeroName = z.infer<typeof HeroNameSchema>;

export const HeroTypeSchema = z.enum([
    "/heroes/transformations/invisible-woman-headbig-0.webp",
    "/heroes/transformations/jeff-the-land-shark-headbig-0.webp",
    "/heroes/transformations/mister-fantastic-headbig-0.webp",
    "/heroes/transformations/squirrel-girl-headbig-0.webp",
]);
export type HeroType = z.infer<typeof HeroTypeSchema>;

export const HeroMatchupSchema = z.object({
    "hero_id": z.union([z.number(), z.null()]),
    "hero_name": z.string(),
    "hero_class": HeroClassSchema,
    "hero_thumbnail": z.union([z.null(), z.string()]),
    "matches": z.number(),
    "wins": z.number(),
    "win_rate": z.string(),
});
export type HeroMatchup = z.infer<typeof HeroMatchupSchema>;

export const MainAttackSchema = z.object({
    "total": z.number(),
    "hits": z.number(),
});
export type MainAttack = z.infer<typeof MainAttackSchema>;

export const MapSchema = z.object({
    "map_id": z.number(),
    "map_thumbnail": z.string().optional(),
    "matches": z.number(),
    "wins": z.number(),
    "kills": z.number(),
    "deaths": z.number(),
    "assists": z.number(),
    "play_time": z.number(),
});
export type Map = z.infer<typeof MapSchema>;

export const IsWinSchema = z.object({
    "score": z.number(),
    "is_win": z.boolean(),
});
export type IsWin = z.infer<typeof IsWinSchema>;

export const RankedSchema = z.object({
    "total_matches": z.number(),
    "total_wins": z.number(),
    "total_assists": z.number(),
    "total_deaths": z.number(),
    "total_kills": z.number(),
    "total_time_played": z.string(),
    "total_time_played_raw": z.number(),
    "total_mvp": z.number(),
    "total_svp": z.number(),
});
export type Ranked = z.infer<typeof RankedSchema>;

export const IconSchema = z.object({
    "player_icon_id": z.string(),
    "player_icon": z.string(),
});
export type Icon = z.infer<typeof IconSchema>;

export const RankGameSeasonSchema = z.object({
    "rank_game_id": z.number(),
    "level": z.number(),
    "rank_score": z.number(),
    "max_level": z.number(),
    "max_rank_score": z.number(),
    "update_time": z.number(),
    "win_count": z.number(),
    "protect_score": z.number(),
    "diff_score": z.number(),
});
export type RankGameSeason = z.infer<typeof RankGameSeasonSchema>;

export const RankSchema = z.object({
    "rank": z.string(),
    "image": z.string(),
    "color": z.string(),
});
export type Rank = z.infer<typeof RankSchema>;

export const TeamSchema = z.object({
    "club_team_id": z.string(),
    "club_team_mini_name": z.string(),
    "club_team_type": z.string(),
});
export type Team = z.infer<typeof TeamSchema>;

export const LevelProgressionSchema = z.object({
    "from": z.number(),
    "to": z.number(),
});
export type LevelProgression = z.infer<typeof LevelProgressionSchema>;

export const ScoreProgressionSchema = z.object({
    "add_score": z.number(),
    "total_score": z.number(),
});
export type ScoreProgression = z.infer<typeof ScoreProgressionSchema>;

export const PlayerInfoSchema = z.object({
    "nick_name": z.string(),
    "player_icon": z.string(),
    "player_uid": z.number(),
});
export type PlayerInfo = z.infer<typeof PlayerInfoSchema>;

export const UpdatesSchema = z.object({
    "info_update_time": z.string(),
    "last_history_update": z.null(),
    "last_inserted_match": z.null(),
    "last_update_request": z.null(),
});
export type Updates = z.infer<typeof UpdatesSchema>;

export const HeroesRankedSchema = z.object({
    "hero_id": z.number(),
    "hero_name": z.string(),
    "hero_thumbnail": z.string(),
    "matches": z.number(),
    "wins": z.number(),
    "mvp": z.number(),
    "svp": z.number(),
    "kills": z.number(),
    "deaths": z.number(),
    "assists": z.number(),
    "play_time": z.number(),
    "damage": z.number(),
    "heal": z.number(),
    "damage_taken": z.number(),
    "main_attack": MainAttackSchema,
});
export type HeroesRanked = z.infer<typeof HeroesRankedSchema>;

export const PlayerPerformanceSchema = z.object({
    "player_uid": z.number(),
    "hero_id": z.number(),
    "hero_name": HeroNameSchema,
    "hero_type": HeroTypeSchema,
    "kills": z.number(),
    "deaths": z.number(),
    "assists": z.number(),
    "is_win": IsWinSchema,
    "disconnected": z.boolean(),
    "camp": z.number(),
    "score_change": z.union([z.number(), z.null()]),
    "level": z.union([z.number(), z.null()]),
    "new_level": z.union([z.number(), z.null()]),
    "new_score": z.union([z.number(), z.null()]),
});
export type PlayerPerformance = z.infer<typeof PlayerPerformanceSchema>;

export const OverallStatsSchema = z.object({
    "total_matches": z.number(),
    "total_wins": z.number(),
    "unranked": RankedSchema,
    "ranked": RankedSchema,
});
export type OverallStats = z.infer<typeof OverallStatsSchema>;

export const InfoSchema = z.object({
    "completed_achievements": z.string(),
    "login_os": z.string(),
    "rank_game_season": z.record(z.string(), RankGameSeasonSchema),
});
export type Info = z.infer<typeof InfoSchema>;

export const RankHistorySchema = z.object({
    "match_time_stamp": z.number(),
    "level_progression": LevelProgressionSchema,
    "score_progression": ScoreProgressionSchema,
});
export type RankHistory = z.infer<typeof RankHistorySchema>;

export const TeamMateSchema = z.object({
    "player_info": PlayerInfoSchema,
    "matches": z.number(),
    "wins": z.number(),
    "win_rate": z.string(),
});
export type TeamMate = z.infer<typeof TeamMateSchema>;

export const MatchHistorySchema = z.object({
    "match_uid": z.string(),
    "map_id": z.number(),
    "map_thumbnail": z.string(),
    "duration": z.number(),
    "season": z.number(),
    "winner_side": z.number(),
    "mvp_uid": z.number(),
    "svp_uid": z.number(),
    "match_time_stamp": z.number(),
    "play_mode_id": z.number(),
    "game_mode_id": z.number(),
    "score_info": z.union([z.record(z.string(), z.number()), z.null()]),
    "player_performance": PlayerPerformanceSchema,
});
export type MatchHistory = z.infer<typeof MatchHistorySchema>;

export const PlayerSchema = z.object({
    "uid": z.number(),
    "level": z.string(),
    "name": z.string(),
    "icon": IconSchema,
    "rank": RankSchema,
    "team": TeamSchema,
    "info": InfoSchema,
});
export type Player = z.infer<typeof PlayerSchema>;

export const StatsSchema = z.object({
    "uid": z.number(),
    "name": z.string(),
    "updates": UpdatesSchema,
    "player": PlayerSchema,
    "isPrivate": z.boolean(),
    "overall_stats": OverallStatsSchema,
    "match_history": z.array(MatchHistorySchema),
    "rank_history": z.array(RankHistorySchema),
    "hero_matchups": z.array(HeroMatchupSchema),
    "team_mates": z.array(TeamMateSchema),
    "heroes_ranked": z.array(HeroesRankedSchema),
    "heroes_unranked": z.array(HeroesRankedSchema),
    "maps": z.array(MapSchema),
});
export type Stats = z.infer<typeof StatsSchema>;
