"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heroImage = void 0;
var sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.heroImage = (0, sqlite_core_1.sqliteTable)('hero_image', {
    id: (0, sqlite_core_1.integer)('id').primaryKey(),
    file: (0, sqlite_core_1.text)('file').notNull(),
    altText: (0, sqlite_core_1.text)('alt_text').notNull(),
    credit: (0, sqlite_core_1.text)('credit'),
    creditUrl: (0, sqlite_core_1.text)('credit_url'),
    creditUrlText: (0, sqlite_core_1.text)('credit_url_text'),
});
