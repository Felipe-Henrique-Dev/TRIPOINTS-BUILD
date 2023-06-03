"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
class ApiController {
    async editProfile({ request, response, auth }) {
        const token = request.header('Authorization')?.replace('Bearer ', '') ?? request.cookie('token');
        if (token) {
            const photo = request.file('photo');
            const usuario = request.input('usuario');
            const user = await User_1.default.findByOrFail('remember_me_token', token);
            if (user) {
                if (usuario) {
                    try {
                        const userExists = await User_1.default.findByOrFail('username', usuario);
                        if (userExists) {
                            return response.json({ error: 'Usuário já existe' });
                        }
                    }
                    catch (error) {
                        user.username = usuario;
                        user.save();
                    }
                }
            }
            if (photo) {
                console.log(photo.extname);
                await photo.move(Application_1.default.publicPath('uploads/perfil'), {
                    name: `${user.username}.${photo.extname}`,
                    overwrite: true
                });
                user.profile_picture = `${user.username}.${photo.extname}`;
                user.save();
            }
            if (!photo && !usuario) {
                return response.json({ error: 'Nada para atualizar' });
            }
            return response.status(200).json({ success: 'Perfil atualizado com sucesso' });
        }
    }
    async getProfile({ request, response, auth }) {
        const token = request.header('Authorization')?.replace('Bearer ', '') ?? request.cookie('token');
        if (token) {
            const user = await auth.use('api').authenticate();
            return response.json({ usuario: user?.username, vitorias: user?.vitorias, derrotas: user?.derrotas, photo: user?.profile_picture });
        }
    }
}
exports.default = ApiController;
//# sourceMappingURL=ApiController.js.map