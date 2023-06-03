"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
Route_1.default.group(() => {
    Route_1.default.get('/logout', async ({ auth, response }) => {
        await auth.use('api').revoke();
        response.clearCookie('token');
        return response.redirect('/');
    });
    Route_1.default.post('/api/user', 'ApiController.getProfile');
    Route_1.default.post('/api/____edit-profile', 'ApiController.editProfile');
    Route_1.default.get('/match', async ({ view, request, response }) => {
        const token = request.header('Authorization')?.replace('Bearer ', '') ?? request.cookie('token');
        if (token != null) {
            const user = await User_1.default.findBy('remember_me_token', token);
            if (user?.$attributes.remember_me_token == token) {
                return view.render('match', { user: user?.username, photo: user?.profile_picture, vitorias: user?.vitorias, derrotas: user?.derrotas });
            }
            else {
                return response.redirect('/');
            }
        }
        else {
            return response.redirect('/');
        }
    });
}).middleware(async (ctx, next) => {
    const token = ctx.request.header('Authorization')?.replace('Bearer ', '') ?? ctx.request.cookie('token');
    if ((token != 'null' == true) && (token != null == true) && (token != undefined == true) && (token != '' == true)) {
        const user = await User_1.default.findBy('remember_me_token', token);
        if (user?.token_expire_at) {
            const date = new Date();
            const tokenExpireAt = new Date(user.token_expire_at);
            if (date > tokenExpireAt) {
                ctx.response.redirect('/');
            }
        }
        if (user?.$attributes.remember_me_token == token) {
            await next();
        }
        else {
            ctx.response.redirect('/');
        }
    }
    else {
        ctx.response.redirect('/');
    }
});
Route_1.default.get('/google/callback', 'LoginsocialsController.google');
Route_1.default.get('/facebook/callback', 'LoginsocialsController.facebook');
Route_1.default.get('/twiter/callback', 'LoginsocialsController.twiter');
Route_1.default.get('/google/redirect', async ({ ally }) => {
    return ally.use('google').redirect();
});
Route_1.default.get('/facebook/redirect', async ({ ally }) => {
    return ally.use('facebook').redirect();
});
Route_1.default.get('/twiter/redirect', async ({ ally }) => {
    return ally.use('twiter').redirect();
});
Route_1.default.get('/verification/new', 'EmailverificacaosController.create');
Route_1.default.post('/verification', 'EmailverificacaosController.store');
Route_1.default.get('/verification/:email', 'EmailverificacaosController.verify');
Route_1.default.get('/', async ({ view }) => {
    return view.render('Home');
});
Route_1.default.post('/api/login', 'LoginController.loginPost');
Route_1.default.get('/api/loginsocial', 'LoginController.loginsocial');
Route_1.default.post('/api/register', 'RegistersController.registerPost');
//# sourceMappingURL=routes.js.map