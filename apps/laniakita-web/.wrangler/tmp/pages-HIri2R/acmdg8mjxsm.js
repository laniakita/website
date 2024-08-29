// <define:__ROUTES__>
var define_ROUTES_default = { version: 1, description: "Built with @cloudflare/next-on-pages@1.13.2.", include: ["/*"], exclude: ["/_next/static/*"] };

// ../../node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/home/lani/Development/website/apps/laniakita-web/.wrangler/tmp/pages-HIri2R/bundledWorker-0.930653002347547.mjs";
import { isRoutingRuleMatch } from "/home/lani/Development/website/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/home/lani/Development/website/apps/laniakita-web/.wrangler/tmp/pages-HIri2R/bundledWorker-0.930653002347547.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        if (worker.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return worker.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=acmdg8mjxsm.js.map
