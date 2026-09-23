import path from "node:path";
import * as cloudflare from "@pulumi/cloudflare";
import * as command from "@pulumi/command";
import * as pulumi from "@pulumi/pulumi";

const stack = pulumi.getStack();
const config = new pulumi.Config();
const cfAccountId = config.get("cloudflareAccountId");

/**
 * Cloudflare D1 Database Resource
 */
const laniakitaD1 = new cloudflare.D1Database(`laniakita-d1-${stack}`, {
	// biome-ignore lint/style/noNonNullAssertion: This should fail loudly
	accountId: cfAccountId!,
	name: `laniakita-d1-${stack}`,
});

/**
 * Cloudflare R2 Public  Bucket Resource
 */
const laniakitaR2Public = new cloudflare.R2Bucket(`laniakita-r2-public-${stack}`, {
	// biome-ignore lint/style/noNonNullAssertion: This should fail loudly
	accountId: cfAccountId!,
	name: `laniakita-public-${stack}`,
	location: "wnam",
	storageClass: "Standard",
});

/**
 * Cloudflare Workers KV Namespace for  Data Service Caching
 */
const laniakitaKvNamespace = new cloudflare.WorkersKvNamespace(`laniakita-kv-namespace-${stack}`, {
	// biome-ignore lint/style/noNonNullAssertion: This should fail loudly
	accountId: cfAccountId!,
	title: `laniakita-${stack}`,
});

const mainWranglerConfig = (async () => {
	const templatePath = path.join(import.meta.dir, "../../../apps/main/wrangler.template.jsonc");
	const targetPath = path.join(import.meta.dir, "../../../apps/main/wrangler.jsonc");

	pulumi.log.info(`[main]: Using wrangler template: ${templatePath}`);
	pulumi.log.info(`[main]: Target wrangler config: ${targetPath}`);

	const currentConfig = Bun.JSONC.parse(await Bun.file(targetPath).text()) as Record<string, unknown>;
	const templateText = await Bun.file(templatePath).text();

	// Preserve cached vars.
	const cachedD1Databases: Record<string, string>[] = currentConfig?.d1_databases as Record<string, string>[];
	const cachedR2Buckets: Record<string, string>[] = currentConfig?.r2_buckets as Record<string, string>[];
	const cachedKvNamespaces: Record<string, string>[] = currentConfig?.kv_namespaces as Record<string, string>[];
	const cachedEnv: Record<string, unknown> = currentConfig?.env as Record<string, unknown>;

	return pulumi
		.all([laniakitaD1.id, laniakitaD1.name, laniakitaR2Public.name, laniakitaKvNamespace.id])
		.apply(([dbId, dbName, publicBucketName, kvId]) => {
			let updatedText = templateText;
			switch (stack) {
				case "staging":
					if (Object.keys(cachedEnv).length > 0) {
						const productionDb = (
							(cachedEnv?.production as Record<string, unknown>)?.d1_databases as Record<string, string>[]
						)?.find((db) => db.binding === "LANI_DB");
						const productionPublicBucket = (
							(cachedEnv?.production as Record<string, unknown>)?.r2_buckets as Record<string, string>[]
						)?.find((bucket) => bucket.binding === "LANI_BUCKET_PUBLIC");
						const productionKv = (
							(cachedEnv?.production as Record<string, unknown>)?.kv_namespaces as Record<string, string>[]
						)?.find((kv) => kv.binding === "LANI_CACHE_KV");

						updatedText = templateText
							.replace("{{PRODUCTION_DATABASE_NAME}}", productionDb?.database_name ?? "")
							.replace("{{PRODUCTION_DATABASE_ID}}", productionDb?.database_id ?? "")
							.replace("{{PRODUCTION_BUCKET_PUBLIC_NAME}}", productionPublicBucket?.bucket_name ?? "")
							.replace("{{PRODUCTION_CACHE_KV_ID}}", productionKv?.id ?? "");
					}
					updatedText = updatedText
						.replace("{{STAGING_DATABASE_ID}}", dbId)
						.replace("{{STAGING_DATABASE_NAME}}", dbName)
						.replace("{{STAGING_BUCKET_PUBLIC_NAME}}", publicBucketName)
						.replace("{{STAGING_CACHE_KV_ID}}", kvId);
					break;
				case "production":
					if (cachedD1Databases?.length > 0) {
						const devDb = cachedD1Databases.find((db) => db.binding === "LANI_DB");
						updatedText = templateText
							.replace("{{STAGING_DATABASE_NAME}}", devDb?.database_name ?? "")
							.replace("{{STAGING_DATABASE_ID}}", devDb?.database_id ?? "");
					}
					if (cachedR2Buckets?.length > 0) {
						const devPublicBucket = cachedR2Buckets.find((bucket) => bucket.binding === "LANI_BUCKET_PUBLIC");
						updatedText = updatedText.replace("{{STAGING_BUCKET_PUBLIC_NAME}}", devPublicBucket?.bucket_name ?? "");
					}
					if (cachedKvNamespaces?.length > 0) {
						const devKv = cachedKvNamespaces.find((kv) => kv.binding === "LANI_CACHE_KV");
						updatedText = updatedText.replace("{{STAGING_CACHE_KV_ID}}", devKv?.id ?? "");
					}
					updatedText = updatedText
						.replace("{{PRODUCTION_DATABASE_ID}}", dbId)
						.replace("{{PRODUCTION_DATABASE_NAME}}", dbName)
						.replace("{{PRODUCTION_BUCKET_PUBLIC_NAME}}", publicBucketName)
						.replace("{{PRODUCTION_CACHE_KV_ID}}", kvId);
					break;
			}

			pulumi.log.debug(`Updated wrangler.jsonc content:\n${updatedText}`);

			return new command.local.Command("laniakita-main-wrangler-writer", {
				create: `bun -e 'await Bun.write("${targetPath}", process.env.WRANGLER_JSONC)'`,
				update: `bun -e 'await Bun.write("${targetPath}", process.env.WRANGLER_JSONC)'`,
				environment: { WRANGLER_JSONC: updatedText },
				triggers: [updatedText, stack],
			});
		});
})();

const laniakitaDevVarsPath = path.join(import.meta.dir, "../../../apps/main/.dev.vars");
const envVars = pulumi.interpolate`CLOUDFLARE_ACCOUNT_ID=${cfAccountId}
CLOUDFLARE_API_TOKEN=${process.env.CLOUDFLARE_API_TOKEN}`;

export const laniakitaDevVars = new command.local.Command("laniakita-dev-vars", {
	create: `bun -e 'await Bun.write("${laniakitaDevVarsPath}", process.env.ENV_VARS)'`,
	update: `bun -e 'await Bun.write("${laniakitaDevVarsPath}", process.env.ENV_VARS)'`,
	environment: { ENV_VARS: envVars },
	triggers: [envVars, stack],
});

/**
 * Exported outputs for use across stacks and runtime Wrangler bindings
 */
export const laniakitaDbId = laniakitaD1.id;
export const laniakitaDbName = laniakitaD1.name;
export const laniakitaBucketPublicName = laniakitaR2Public.name;
export const laniakitaKvNamespaceId = laniakitaKvNamespace.id;
export const laniakitaWranglerConfig = mainWranglerConfig;
