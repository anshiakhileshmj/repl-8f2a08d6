import { relations } from "drizzle-orm/relations";
import { usersInAuth, apiKeys, apiUsage, developerProfiles } from "./schema";

export const apiKeysRelations = relations(apiKeys, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [apiKeys.userId],
		references: [usersInAuth.id]
	}),
	apiUsages: many(apiUsage),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	apiKeys: many(apiKeys),
	developerProfiles: many(developerProfiles),
}));

export const apiUsageRelations = relations(apiUsage, ({one}) => ({
	apiKey: one(apiKeys, {
		fields: [apiUsage.apiKeyId],
		references: [apiKeys.id]
	}),
}));

export const developerProfilesRelations = relations(developerProfiles, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [developerProfiles.userId],
		references: [usersInAuth.id]
	}),
}));