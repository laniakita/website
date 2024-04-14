"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.category = void 0;
var sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.category = (0, sqlite_core_1.sqliteTable)('category', {
    id: (0, sqlite_core_1.integer)('id').primaryKey(),
    title: (0, sqlite_core_1.text)('title').notNull(),
    description: (0, sqlite_core_1.text)('description'),
});
