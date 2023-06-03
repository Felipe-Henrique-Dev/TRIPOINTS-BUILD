"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const config_1 = require("@adonisjs/mail/build/config");
exports.default = (0, config_1.mailConfig)({
    mailer: 'ses',
    mailers: {
        ses: {
            driver: 'ses',
            apiVersion: '2010-12-01',
            key: Env_1.default.get('SES_ACCESS_KEY'),
            secret: Env_1.default.get('SES_ACCESS_SECRET'),
            region: Env_1.default.get('SES_REGION'),
            sslEnabled: true,
            sendingRate: 10,
            maxConnections: 5,
        },
    },
});
//# sourceMappingURL=mail.js.map