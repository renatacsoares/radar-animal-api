// SETUP BASICO

var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// precisa incluir um desse para cada tipo de objeto que quiser salvar no banco de dados
var Animal = require('./app/models/animal');

// configure app to use bodyParser(), this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// codigo para evitar erros de Access-Control-Allow-Origin (parecido com CORS)
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// abre conexao com banco de dados
mongoose.connect('mongodb://localhost/radar-animal-db');

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// DEFINICAO DE APIs

// funcao que salva um animal no banco de dados
router.post('/animais', function(req, res) {
    // dados do animal enviados pelo app
    var animalDoApp = req.body;

    // cria um objeto (mongoose) para salvar os dados no banco.
    // os dados recebidos do app sao copiados para o objeto mongoose
    // automaticamente pois os nomes das propriedades (numero, tipo, etc.)
    // sao os mesmos
    var animalAPI = new Animal(animalDoApp);

    // salva objeto no banco de dados
    animalAPI.save(function(err) {
        if (err) { // em caso de erro (err), log o erro
            res.send(err);
            console.log(err);
        } else {
            console.log("Animal salvo com sucesso");
            res.json({
                message: 'Animal created!'
            });
        }
    });
});

// lista os animais ja salvos no banco de dados
router.get('/animais', function(req, res) {
    Animal.find(function(err, data) {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            // resultado da operacao Animal.find vem como parametro do callack (data)
            console.log("Lista de animais retornada com sucesso");

/*           var animais = [{
              id: 0,
              tipo: 'Gato',
              situacao: 'Abandonado',
              endereco: 'Rua x'
            }, {
              id: 1,
              tipo: 'Cachorro',
              situacao: 'Com fome',
              endereco: 'Rua Y'
            }];

            data = animais;
*/

            console.log(data);
            res.json(data);
        }
    });
});

// lista os animais ja salvos no banco de dados
router.get('/animais/:animal_id', function(req, res) {
    // pega o id passado como parametro na url pelo AnimalService no app
    var id = req.params.animal_id;

    Animal.findById(id, function(err, data) {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            // resultado da operacao Animal.find vem como parametro do callack (data)
            console.log("Animal de ID" + id + " encontrado com sucesso");
            res.json(data);
        }
    });
});

// lista os animais ja salvos no banco de dados
router.delete('/animais/:animal_id', function(req, res) {
    var id = req.params.animal_id;

    Animal.findByIdAndRemove(id, function(err, animal) {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            console.log("Animal excluido com sucesso, id: " + id);
            res.json({
                message: 'Successfully deleted'
            });
        }
    });
});

// lista os animais ja salvos no banco de dados
router.put('/animais/:animal_id', function(req, res) {
    // id informado pela URL no AnimalService
    var id = req.params.animal_id;

    // dados atualizados do animal enviados pelo AnimalService
    var animal = req.body;

    // busca no banco de dados o animal com o id informado e atualiza com os dados recebidos (animal)
    Animal.findByIdAndUpdate(id, animal, function(err, animal) {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            console.log("Dados do animal atualizados com sucesso, id: " + id);
            res.json({
                message: 'Successfully updated'
            });
        }
    });
});

// Cadastra novo usuario
router.post('/usuarios', function(req, res) {
    // dados do usuario enviados pelo app
    var usuarioVindoApp = req.body;

    var usuarioAPI = new Usuario(usuarioVindoApp);

    usuarioAPI.save(function(err) {
        if (err) { // em caso de erro (err), log o erro
            res.send(err);
            console.log(err);
        } else {
            console.log("Usuario salvo com sucesso");
            res.json({
                message: 'Usuario criado!'
            });
        }
    });
});

router.get('/usuarios', function(req, res) {
    Usuario.find(function(err, data) {
        if (err) {
            res.send(err);
            console.log(err);
        } else {

            console.log("Lista de usuarios retornada com sucesso");
            res.json(data);
        }
    });
});
// autenticaçao do usuario e senha
router.post('/auth', function(req, res) {

    var usuarioVindoApp = req.body;

    Usuario.findOne({
        login: usuarioVindoApp.login
    }, function(err, userDB) {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            if (userDB.authenticate(usuarioVindoApp.senha)) {
                console.log("Login realizado com sucesso");
                res.json(userDB);
            } else {
                res.send({
                    message: 'Senha incorreta!'
                });
                console.log('Senha incorreta');
            }
        }
    });
});

router.get('/usuarios/:usuario_id', function(req, res) {
    var id = req.params.usuario_id;
    Usuario.findById(id, function(err, data) {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            console.log("Usuario de ID" + id + " encontrado com sucesso");
            res.json(data);
        }
    });
});

router.delete('/usuarios/:usuario_id', function(req, res) {
    var id = req.params.usuario_id;
    Usuario.findByIdAndRemove(id, function(err, usuario) {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            console.log("Usuario excluido com sucesso, id: " + id);
            res.json({
                message: 'Successfully deleted'
            });
        }
    });
});
// lista as usuarios ja salvas no banco de dados
router.put('/usuarios/:usuario_id', function(req, res) {
    var id = req.params.usuario_id;
    var usuario = req.body;

    Usuario.findByIdAndUpdate(id, usuario, function(err, usuario) {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            console.log("Dados da usuario atualizados com sucesso, id: " + id);
            res.json({
                message: 'Successfully updated'
            });
        }
    });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
