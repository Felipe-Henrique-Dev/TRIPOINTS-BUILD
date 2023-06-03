"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
class EmailverificacaosController {
    async verify({ request, params, response }) {
        if (!request.hasValidSignature()) {
            return response.status(401).json({ message: 'Link de verificação inválido ou expirado.' });
        }
        const user = await User_1.default.findByOrFail('email', params.email);
        if (user.email_verified_at) {
            return response.status(401).json({ message: 'Email já verificado.' });
        }
        user.email_verified_at = luxon_1.DateTime.now();
        await user.save();
        return response.status(200).json({ message: 'Email verificado com sucesso.' });
    }
}
exports.default = EmailverificacaosController;
//# sourceMappingURL=EmailverificacaosController.js.map