"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class LoginController {
    async loginPost({ request, response, auth }) {
        const email = request.input('username');
        const password = request.input('password');
        if (!email || !password) {
            console.log('Email e senha são obrigatórios');
            return response.badRequest({ Erro: 'Email e senha são obrigatórios' });
        }
        const user = await User_1.default.findBy('email', email);
        if (!user) {
            console.log('Email não cadastrado');
            return response.badRequest({ Erro: 'Email não cadastrado' });
        }
        try {
            const user = await User_1.default.findByOrFail('email', email);
            await auth.use('web').attempt(email, password);
            await auth.use('api').revoke();
            if (user.remember_me_token) {
                await Database_1.default.from('api_tokens').where('user_id', user.id).delete();
            }
            var token = await auth.use('api').attempt(email, password, {
                expiresIn: '7 days'
            });
            user.remember_me_token = token.toJSON().token;
            user.token_expire_at = token.toJSON().expires_at;
            await user.save();
            console.log('Logado com sucesso');
            await auth.use('web').login(user);
            auth.use('web').isAuthenticated;
            return response.cookie('token', token.token, { httpOnly: true }).send({ token: token.token });
        }
        catch (error) {
            console.log('Senha incorreta');
            return response.badRequest({ Erro: 'Senha incorreta' });
        }
    }
    async loginsocial({ request, response, auth }) {
        const token = request.header('Authorization')?.replace('Bearer ', '') ?? request.cookie('token');
        if (token) {
            const user = await User_1.default.findByOrFail('remember_me_token', token);
            if (user) {
                await auth.use('api').authenticate();
                auth.use('api').isAuthenticate;
                return response.status(200).send({ token: token });
            }
        }
    }
}
exports.default = LoginController;
//# sourceMappingURL=LoginController.js.map