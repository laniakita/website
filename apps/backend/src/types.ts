import * as v from "valibot";

export const Task = v.object({
	name: v.string(),
	slug: v.string(),
	description: v.optional(v.string()),
	completed: v.optional(v.boolean(), false),
	due_date: v.string(),
});

export type TaskType = v.InferOutput<typeof Task>;
