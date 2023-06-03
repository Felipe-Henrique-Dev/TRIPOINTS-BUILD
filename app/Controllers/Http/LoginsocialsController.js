"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const luxon_1 = require("luxon");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class LoginsocialsController {
    async google({ request, response, auth, ally }) {
        const google = ally.use('google');
        console.log('aqui');
        if (google.accessDenied()) {
            return response.status(401).redirect('/');
        }
        if (google.stateMisMatch()) {
            return response.status(400).redirect('/');
        }
        if (google.hasError()) {
            return google.getError();
        }
        const socialuser = await google.user();
        try {
            const user = await User_1.default.query().where('email', socialuser.email).first();
            console.log('aqui ooooooooo');
            console.log(user);
            if (user) {
                if (user.remember_me_token) {
                    await Database_1.default.from('api_tokens').where('user_id', user.id).delete();
                }
                const token = await auth.use('api').generate(user, {
                    expiresIn: '7 days'
                });
                user.remember_me_token = token.token;
                user.token_expire_at = token.expire_at;
                user.save();
                response.cookie('token', token.token, { httpOnly: true }).send({ token: token.token });
                return response.send(`  
                    <script>
                    const token = '${token.token}';
                    localStorage.setItem('token', token);
                
                    // Faz a solicitação para a rota '/match' com o cabeçalho de autorização
                    fetch('/api/loginsocial', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        }
                    })
                    .then(response => {
                        window.location.href = '/match';
                    })
                    .catch(error => {
                        console.error('Erro na solicitação:', error);
                        console.error('Erro na solicitação:', error);
                    });
                </script>
                    `);
            }
            else {
                const user = await User_1.default.create({
                    email: socialuser.email,
                    username: socialuser.original.given_name + socialuser.id[0] + socialuser.id[3] + socialuser.id[6] + socialuser.id[9],
                    password: socialuser.id,
                    provider: 'google',
                    provider_id: socialuser.id,
                    name: socialuser.original.given_name,
                    sobrenome: socialuser.original.family_name,
                    profile_picture: socialuser.original.given_name + socialuser.id[0] + socialuser.id[3] + socialuser.id[6] + socialuser.id[9] + '.png',
                    vitorias: 0,
                    derrotas: 0
                });
                if (user.remember_me_token) {
                    await Database_1.default.from('api_tokens').where('user_id', user.id).delete();
                }
                const token = await auth.use('api').generate(user, {
                    expiresIn: '7 days'
                });
                user.remember_me_token = token.token;
                user.token_expire_at = token.expire_at;
                user.save();
                const profile_picture = await axios.get(socialuser.avatarUrl, { responseType: 'arraybuffer' });
                fs.writeFileSync(path.join(Application_1.default.publicPath('uploads/perfil'), `${user.username}.png`), profile_picture.data);
                await auth.login(user);
                response.cookie('token', token.token, { httpOnly: true }).send({ token: token.token });
                return response.send(`  
                    <script>
                    const token = '${token.token}';
                    localStorage.setItem('token', token);
                
                    // Faz a solicitação para a rota '/match' com o cabeçalho de autorização
                    fetch('/api/loginsocial', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        }
                    })
                    .then(response => {
                        window.location.href = '/match';
                    })
                    .catch(error => {
                        console.error('Erro na solicitação:', error);
                        console.error('Erro na solicitação:', error);
                    });
                </script>
                    `);
            }
        }
        catch (error) {
            console.log('deu ruim aqui');
        }
    }
    async facebook({ request, response, auth, ally }) {
        const facebook = ally.use('facebook');
        console.log('aqui');
        if (facebook.accessDenied()) {
            response.status(401).redirect('/');
            return;
        }
        if (facebook.stateMisMatch()) {
            response.status(400).redirect('/');
            return;
        }
        if (facebook.hasError()) {
            return facebook.getError();
        }
        const socialuser = await facebook.user();
        try {
            const user = await User_1.default.query().where('email', socialuser.email).first();
            if (user) {
                if (user.remember_me_token) {
                    await Database_1.default.from('api_tokens').where('user_id', user.id).delete();
                }
                const token = await auth.use('api').generate(user, {
                    expiresIn: '7 days'
                });
                user.remember_me_token = token.token;
                user.token_expire_at = token.expire_at;
                user.save();
                response.cookie('token', token.token, { httpOnly: true }).send({ token: token.token });
                return response.send(`  
                    <script>
                    const token = '${token.token}';
                    localStorage.setItem('token', token);
                
                    // Faz a solicitação para a rota '/match' com o cabeçalho de autorização
                    fetch('/api/loginsocial', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        }
                    })
                    .then(response => {
                        window.location.href = '/match';
                    })
                    .catch(error => {
                        console.error('Erro na solicitação:', error);
                        console.error('Erro na solicitação:', error);
                    });
                </script>
                    `);
            }
            else {
                const user = await User_1.default.create({
                    email: socialuser.email,
                    username: socialuser.original.first_name + socialuser.id[0] + socialuser.id[3] + socialuser.id[6] + socialuser.id[9],
                    password: socialuser.id,
                    provider: 'facebook',
                    provider_id: socialuser.id,
                    name: socialuser.original.last_name,
                    sobrenome: socialuser.original.family_name,
                    profile_picture: socialuser.original.first_name + socialuser.id[0] + socialuser.id[3] + socialuser.id[6] + socialuser.id[9] + '.png',
                    vitorias: 0,
                    derrotas: 0
                });
                if (user.remember_me_token) {
                    await Database_1.default.from('api_tokens').where('user_id', user.id).delete();
                }
                const token = await auth.use('api').generate(user, {
                    expiresIn: '7 days'
                });
                user.remember_me_token = token.token;
                user.token_expire_at = token.expire_at;
                user.save();
                const profile_picture = await axios.get(socialuser.avatarUrl, { responseType: 'arraybuffer' });
                fs.writeFileSync(path.join(Application_1.default.publicPath('uploads/perfil'), `${user.username}.png`), profile_picture.data);
                await auth.login(user);
                response.cookie('token', token.token, { httpOnly: true }).send({ token: token.token });
                return response.send(`  
                    <script>
                    const token = '${token.token}';
                    localStorage.setItem('token', token);
                
                    // Faz a solicitação para a rota '/match' com o cabeçalho de autorização
                    fetch('/api/loginsocial', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        }
                    })
                    .then(response => {
                        window.location.href = '/match';
                    })
                    .catch(error => {
                        console.error('Erro na solicitação:', error);
                        console.error('Erro na solicitação:', error);
                    });
                </script>
                    `);
            }
        }
        catch (error) {
            console.log('deu ruim aqui');
        }
    }
    async github({ request, response, auth }) {
        const github = auth.use('github');
        const githubUser = await github.user();
        const user = await User_1.default.firstOrCreate({ email: githubUser.email }, {
            username: githubUser.name,
            email: githubUser.email,
            password: githubUser.id,
            profile_picture: githubUser.avatarUrl,
            email_verified_at: luxon_1.DateTime.now()
        });
        const token = await auth.use('api').generate(user, {
            expiresIn: '1day'
        });
        user.remember_me_token = token.token;
        user.token_expire_at = token.expiresAt;
        user.save();
        return response.redirect('/match');
    }
}
exports.default = LoginsocialsController;
//# sourceMappingURL=LoginsocialsController.js.map