"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const VerifyEmail_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Mailers/VerifyEmail"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
Event_1.default.on('email-verificacao', (user) => {
    new VerifyEmail_1.default(user).send();
});
//# sourceMappingURL=events.js.map