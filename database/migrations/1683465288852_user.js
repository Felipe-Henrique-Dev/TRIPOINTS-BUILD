"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'users';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('email', 255).notNullable().unique();
            table.string('password', 180).nullable();
            table.string('username', 255).nullable().unique();
            table.string('provider', 255).nullable();
            table.string('provider_id', 255).nullable();
            table.string('vitorias', 255).nullable();
            table.string('derrotas', 255).nullable();
            table.string('name', 255).nullable();
            table.string('sobrenome', 255).nullable();
            table.string('profile_picture', 255).nullable();
            table.timestamp('email_verified_at').nullable();
            table.string('remember_me_token').nullable();
            table.string('token_expire_at').nullable();
            table.timestamps(true, true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1683465288852_user.js.map