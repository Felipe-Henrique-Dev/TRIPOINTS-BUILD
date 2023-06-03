"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Ws_1 = __importDefault(global[Symbol.for('ioc.use')]("Ruby184/Socket.IO/Ws"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
class Index {
    async Index() {
        var wait = [];
        const SALA = {};
        const playerInGame = [];
        Ws_1.default.io.on('connection', (socket) => {
            socket.on('disconnect', () => {
                try {
                    let salaValues = Object.values(SALA);
                    salaValues.forEach((sala) => {
                        if (sala.id1.id == socket.id) {
                            Ws_1.default.io.to(sala.id2.id).emit('disconect', 'disconect');
                            const nome = sala.id2.user.nome;
                            const nome2 = sala.id1.user.nome;
                            playerInGame.splice(playerInGame.indexOf(nome), 1);
                            playerInGame.splice(playerInGame.indexOf(nome2), 1);
                            delete SALA['room-' + socket.id];
                            socket.leave('room-' + socket.id);
                            wait.indexOf('room-' + socket.id) > -1 ? wait.splice(wait.indexOf('room-' + socket.id), 1) : null;
                        }
                        else if (sala.id2.id == socket.id) {
                            Ws_1.default.io.to(sala.id1.id).emit('disconect', 'disconect');
                            const nome = sala.id1.user.nome;
                            const nome2 = sala.id2.user.nome;
                            playerInGame.splice(playerInGame.indexOf(nome), 1);
                            playerInGame.splice(playerInGame.indexOf(nome2), 1);
                            delete SALA['room-' + sala.id1.id];
                            socket.leave('room-' + sala.id1.id);
                            wait.indexOf('room-' + sala.id1.id) > -1 ? wait.splice(wait.indexOf('room-' + sala.id1.id), 1) : null;
                        }
                    });
                }
                catch (err) {
                    socket.to(socket.id).emit('disconect', 'disconect');
                }
            });
            socket.on('join-game', (data) => {
                const msg = data;
                const name = msg.nome;
                if (Number(playerInGame.indexOf(name)) != -1) {
                    Ws_1.default.io.to(socket.id).emit('usuario-ja-esta-em-uma-partida', 'usuario-ja-esta-em-uma-partida');
                    return;
                }
                if (msg.end == 'join-game' && SALA['room-' + socket.id] == undefined) {
                    if (wait.length == 0) {
                        socket.join('room-' + socket.id);
                        wait.push('room-' + socket.id);
                        playerInGame.push(name);
                        SALA['room-' + socket.id] = {
                            'playerWin': 'false',
                            id1: {
                                user: {
                                    img: msg.img,
                                    nome: msg.nome
                                },
                                id: socket.id,
                                joquempô: '',
                                jogadas: {
                                    peças: [],
                                    grid: []
                                }
                            },
                            id2: {
                                user: {
                                    img: '',
                                    nome: ''
                                },
                                id: '',
                                joquempô: '',
                                jogadas: {
                                    peças: [],
                                    grid: []
                                }
                            }
                        };
                    }
                    else {
                        var room = wait[0];
                        socket.join(room);
                        playerInGame.push(name);
                        const infos = {
                            'match': 'match',
                            'user1': {
                                img: SALA[room].id1.user.img,
                                nome: SALA[room].id1.user.nome,
                            },
                            'user2': {
                                img: msg.img,
                                nome: msg.nome,
                            }
                        };
                        SALA[room].id2.id = socket.id;
                        SALA[room].id2.user.img = msg.img;
                        SALA[room].id2.user.nome = msg.nome;
                        Ws_1.default.io.in(SALA[room].id1.id).emit('partida-encontrada', { infos, 'You': 'id1' });
                        Ws_1.default.io.in(SALA[room].id2.id).emit('partida-encontrada', { infos, 'You': 'id2' });
                        wait = [];
                        return;
                    }
                }
            });
            socket.on('leave-game', async (data) => {
                const room = Array.from(socket.rooms)[1];
                try {
                    if (data.Win != undefined) {
                        var jogardorWin = data.Win;
                        var jogadorLose = data.Loss;
                        const userWin = await User_1.default.query().where('username', jogardorWin).first();
                        const userLose = await User_1.default.query().where('username', jogadorLose).first();
                        if (SALA[room].playerWin == 'false') {
                            userWin.vitorias = Number(userWin.vitorias) + 1;
                            userLose.derrotas = Number(userLose.derrotas) + 1;
                            await userWin?.save();
                            await userLose?.save();
                        }
                    }
                    const name1 = SALA[room].id1.user.nome;
                    const name2 = SALA[room].id2.user.nome;
                    playerInGame.splice(playerInGame.indexOf(name1), 1);
                    playerInGame.splice(playerInGame.indexOf(name2), 1);
                    delete SALA[room];
                    socket.leave(room);
                    wait.indexOf(room) > -1 ? wait.splice(wait.indexOf(room), 1) : null;
                }
                catch (err) {
                    socket.leave(room);
                }
            });
            socket.on('joquempô', (data) => {
                const room = Array.from(socket.rooms)[1];
                const sala = String(room).replace('"', '').replace('"', '');
                const id = socket.id;
                if (data == 'joquempô') {
                    return;
                }
                if (SALA[sala].id1.id == id) {
                    SALA[room].id1.joquempô = data;
                    if (SALA[room].id2.joquempô == '') {
                        socket.to(SALA[room].id2.id).emit('adPronto', 'Adversario Pronto');
                    }
                }
                else {
                    SALA[room].id2.joquempô = data;
                    if (SALA[room].id1.joquempô == '') {
                        socket.to(SALA[room].id1.id).emit('adPronto', 'Adversario Pronto');
                    }
                }
                var classes = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'g13', 'g14', 'g15', 'g16'];
                var selectedClasses = [];
                if (selectedClasses.length == 0) {
                    for (var i = 0; i < 2; i++) {
                        var randomIndex = Math.floor(Math.random() * classes.length);
                        var selectedClass = classes.splice(randomIndex, 1)[0];
                        selectedClasses.push(selectedClass);
                    }
                }
                const resultado = {
                    'id1': {
                        'jogada': '',
                        'Result': ''
                    },
                    'id2': {
                        'jogada': '',
                        'Result': ''
                    },
                    'Grid': selectedClasses
                };
                if (SALA[sala].id1.joquempô != '' && SALA[sala].id2.joquempô != '') {
                    var jogadaID1 = SALA[sala].id1.joquempô;
                    var jogadaID2 = SALA[sala].id2.joquempô;
                    if (jogadaID1 == 'pedra' && jogadaID2 == 'tesoura') {
                        resultado.id1.jogada = 'pedra';
                        resultado.id2.jogada = 'tesoura';
                        resultado.id1.Result = 'vitoria';
                        resultado.id2.Result = 'derrota';
                    }
                    else if (jogadaID1 == 'pedra' && jogadaID2 == 'papel') {
                        resultado.id1.jogada = 'pedra';
                        resultado.id2.jogada = 'papel';
                        resultado.id1.Result = 'derrota';
                        resultado.id2.Result = 'vitoria';
                    }
                    else if (jogadaID1 == 'tesoura' && jogadaID2 == 'papel') {
                        resultado.id1.jogada = 'tesoura';
                        resultado.id2.jogada = 'papel';
                        resultado.id1.Result = 'vitoria';
                        resultado.id2.Result = 'derrota';
                    }
                    else if (jogadaID1 == 'tesoura' && jogadaID2 == 'pedra') {
                        resultado.id1.jogada = 'tesoura';
                        resultado.id2.jogada = 'pedra';
                        resultado.id1.Result = 'derrota';
                        resultado.id2.Result = 'vitoria';
                    }
                    else if (jogadaID1 == 'papel' && jogadaID2 == 'pedra') {
                        resultado.id1.jogada = 'papel';
                        resultado.id2.jogada = 'pedra';
                        resultado.id1.Result = 'vitoria';
                        resultado.id2.Result = 'derrota';
                    }
                    else if (jogadaID1 == 'papel' && jogadaID2 == 'tesoura') {
                        resultado.id1.jogada = 'papel';
                        resultado.id2.jogada = 'tesoura';
                        resultado.id1.Result = 'derrota';
                        resultado.id2.Result = 'vitoria';
                    }
                    else {
                        resultado.id1.jogada = jogadaID1;
                        resultado.id2.jogada = jogadaID2;
                        resultado.id1.Result = 'empate';
                        resultado.id2.Result = 'empate';
                    }
                    return Ws_1.default.io.to(sala).emit('result-joquenpo', resultado);
                }
            });
            socket.on('jogada', async (data) => {
                const room = Array.from(socket.rooms)[1];
                const sala = JSON.stringify(room).replace('"', '').replace('"', '');
                const jogada = data;
                const id = socket.id;
                var idAdversario = '';
                if (SALA[sala].id1.id == id) {
                    SALA[sala].id1.jogadas.peças.push(jogada.peça);
                    SALA[sala].id1.jogadas.grid.push(jogada.grid);
                    idAdversario = SALA[sala].id2.id;
                    if (jogada.resultado != 'false') {
                        SALA[sala].playerWin = 'true';
                        const user1 = SALA[sala].id1.user.nome;
                        const user2 = SALA[sala].id2.user.nome;
                        const setVitoria = await User_1.default.findByOrFail('username', user1);
                        const setDerrota = await User_1.default.findByOrFail('username', user2);
                        const vitoria = Number(setVitoria.vitorias) + 1;
                        const derrota = Number(setDerrota.derrotas) + 1;
                        setVitoria.vitorias = vitoria;
                        setDerrota.derrotas = derrota;
                        setVitoria.save();
                        setDerrota.save();
                    }
                }
                else {
                    SALA[sala].id2.jogadas.peças.push(jogada.peça);
                    SALA[sala].id2.jogadas.grid.push(jogada.grid);
                    idAdversario = SALA[sala].id1.id;
                    if (jogada.resultado != 'false') {
                        const user1 = SALA[sala].id1.user.nome;
                        const user2 = SALA[sala].id2.user.nome;
                        const setVitoria = await User_1.default.findByOrFail('username', user2);
                        const setDerrota = await User_1.default.findByOrFail('username', user1);
                        const vitoria = Number(setVitoria.vitorias) + 1;
                        const derrota = Number(setDerrota.derrotas) + 1;
                        setVitoria.vitorias = vitoria;
                        setDerrota.derrotas = derrota;
                        setVitoria.save();
                        setDerrota.save();
                    }
                }
                socket.to(idAdversario).emit('input-Game', jogada);
            });
            socket.on('passar-vez', (data) => {
                const room = Array.from(socket.rooms)[1];
                const sala = JSON.stringify(room).replace('"', '').replace('"', '');
                const id = socket.id;
                var idAdversario = '';
                var jogada = {
                    peça: 'passar-vez',
                    grid: 'passar-vez',
                    'resultado': '',
                    'grid_sobrepor': ''
                };
                if (SALA[sala].id1.id == id) {
                    idAdversario = SALA[sala].id2.id;
                }
                else {
                    idAdversario = SALA[sala].id1.id;
                }
                socket.to(idAdversario).emit('input-Game-Timer', jogada);
            });
            socket.on('empate', (data) => {
                const room = Array.from(socket.rooms)[1];
                const sala = JSON.stringify(room).replace('"', '').replace('"', '');
                SALA[sala].id1.joquempô = '';
                SALA[sala].id2.joquempô = '';
                const infos = {
                    'match': 'match',
                    'user1': {
                        img: SALA[room].id1.user.img,
                        nome: SALA[room].id1.user.nome,
                    },
                    'user2': {
                        img: SALA[room].id2.user.img,
                        nome: SALA[room].id2.user.nome,
                    }
                };
                Ws_1.default.io.to(SALA[room].id1.id).emit('partida-encontrada', 'empate');
                Ws_1.default.io.to(SALA[room].id2.id).emit('partida-encontrada', 'empate');
            });
        });
    }
}
exports.default = Index;
//# sourceMappingURL=Index.js.map