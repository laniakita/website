"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.author = void 0;
var sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.author = (0, sqlite_core_1.sqliteTable)('author', {
    id: (0, sqlite_core_1.integer)('id').primaryKey(),
    name: (0, sqlite_core_1.text)('name').notNull(),
    bio: (0, sqlite_core_1.text)('bio'),
    mastodon: (0, sqlite_core_1.text)('mastodon')
});
