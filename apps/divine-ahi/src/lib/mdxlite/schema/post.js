"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.post = void 0;
var sqlite_core_1 = require("drizzle-orm/sqlite-core");
var author_1 = require("./author");
var hero_image_1 = require("./hero-image");
var category_1 = require("./category");
exports.post = (0, sqlite_core_1.sqliteTable)('post', {
    id: (0, sqlite_core_1.integer)('id').primaryKey(),
    author: (0, sqlite_core_1.text)('author').references(function () { return author_1.author.name; }).notNull(),
    date: (0, sqlite_core_1.text)('date').notNull(),
    headline: (0, sqlite_core_1.text)('headline').notNull(),
    subheadline: (0, sqlite_core_1.text)('subheadline'),
    category: (0, sqlite_core_1.text)('category').references(function () { return category_1.category.title; }),
    heroFile: (0, sqlite_core_1.text)('hero_file').references(function () { return hero_image_1.heroImage.file; }),
    heroCredit: (0, sqlite_core_1.text)('hero_credit').references(function () { return hero_image_1.heroImage.credit; }),
    heroCreditUrl: (0, sqlite_core_1.text)('hero_credit_url').references(function () { return hero_image_1.heroImage.creditUrl; }),
    heroCreditUrlText: (0, sqlite_core_1.text)('hero_credit_url_text').references(function () { return hero_image_1.heroImage.creditUrlText; }),
    heroAltText: (0, sqlite_core_1.text)('hero_alt_text').references(function () { return hero_image_1.heroImage.altText; }),
    content: (0, sqlite_core_1.text)('content'),
});
