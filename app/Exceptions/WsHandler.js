"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const WsExceptionHandler_1 = __importDefault(global[Symbol.for('ioc.use')]("Ruby184/Socket.IO/WsExceptionHandler"));
class ExceptionHandler extends WsExceptionHandler_1.default {
    constructor() {
        super(Application_1.default);
    }
}
exports.default = ExceptionHandler;
//# sourceMappingURL=WsHandler.js.map