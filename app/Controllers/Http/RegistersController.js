"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class RegistersController {
    async registerPost({ request, response, auth }) {
        var errors = {};
        try {
            const payload = await request.validate({
                schema: Validator_1.schema.create({
                    email: Validator_1.schema.string({ trim: true }, [
                        Validator_1.rules.email(),
                        Validator_1.rules.unique({ table: 'users', column: 'email' }),
                    ]),
                    password: Validator_1.schema.string({ trim: true }, [
                        Validator_1.rules.minLength(8),
                        Validator_1.rules.maxLength(12),
                        Validator_1.rules.confirmed('confirm_password')
                    ]),
                    username: Validator_1.schema.string({ trim: true }, [
                        Validator_1.rules.unique({ table: 'users', column: 'username' }),
                    ]),
                    profile_picture: Validator_1.schema.string({ trim: true }),
                    name: Validator_1.schema.string({ trim: true }),
                    sobrenome: Validator_1.schema.string({ trim: true }),
                }),
                messages: {
                    'confirmed': 'As senhas não coincidem',
                    'email.required': 'Email é obrigatório',
                    'email.email': 'Email inválido',
                    'email.unique': 'Email já cadastrado',
                    'password.required': 'Senha é obrigatória',
                    'password.minLength': 'Deve ter no mínimo 8 caracteres',
                    'password.maxLength': 'Deve ter no máximo 12 caracteres',
                    'password.confirmed': 'As senhas não coincidem',
                    'password_confirmation.required': 'Confirmação de senha é obrigatória',
                    'password_confirmation.minLength': 'Deve ter no mínimo 8 caracteres',
                    'password_confirmation.maxLength': 'Deve ter no máximo 12 caracteres',
                    'password_confirmation.confirmed': 'As senhas não coincidem',
                    'username.required': 'Username é obrigatório',
                    'username.unique': 'Username já cadastrado',
                    'profile_picture.required': 'Foto de perfil é obrigatória',
                    'name.required': 'Nome é obrigatório',
                    'sobrenome.required': 'Sobrenome é obrigatório',
                }
            }).catch((error) => {
                console.log('Erro ao validar o usuário');
                errors = error.messages;
                return response.status(400).json({ Error: error.messages });
            });
            const newUser = await User_1.default.create({
                email: payload.email,
                password: payload.password,
                username: payload.username,
                profile_picture: 'null.jpg',
                name: payload.name,
                sobrenome: payload.sobrenome,
                vitorias: 0,
                derrotas: 0,
            }).catch((error) => {
                console.log('Erro ao criar o usuário');
                return response.status(200).json({ Error: error });
            });
            newUser.save();
            return response.status(200).json({ Sucess: 'Foi enviado um email de confirmação para o seu email, por favor confirme para poder logar!' });
        }
        catch (error) {
            return response.status(200).json({ Error: errors });
        }
    }
}
exports.default = RegistersController;
//# sourceMappingURL=RegistersController.js.map