var mongoose = require('mongoose'); // for working w/ our database
var UserSchema       = require('../models/user');
var User = mongoose.model('User', UserSchema);
var ReferenciaSchema       = require('../models/referencia');
var Referencia       = mongoose.model('Referencia', ReferenciaSchema);
var ServicioSchema = require('../models/servicio');
var Servicio =  mongoose.model('Servicio', ServicioSchema);
var IdServicioSchema = require('../models/idServicio');
var IdServicio =  mongoose.model('IdServicio', IdServicioSchema);
var jwt        = require('jsonwebtoken');
var config     = require('../../config');
// super secret for creating tokens
var superSecret = config.secret;
module.exports = function(app, express) {

	var apiRouter = express.Router();

	apiRouter.route('/users')

	// create a user (accessed at POST http://localhost:8080/api/users)
	.post(function(req, res) {

		if((req.body.name&&req.body.username&&req.body.password)){
			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)
			user.ofertante = req.body.ofertante;
			user.alba = req.body.alba;
			user.carp = req.body.carp;
			user.elec = req.body.elec;
			user.jard = req.body.jard;
			user.pint = req.body.pint;
			user.plom = req.body.plom;
			user.ciudad = req.body.ciudad;
			user.descripcion = req.body.descripcion;
			user.direccion = req.body.direccion;
			user.perfil = req.body.perfil;
			user.telefono = req.body.telefono;
			user.estrellas = req.body.estrellas;
			user.votos = req.body.votos;
			user.trabajos = [];
			var i = 0;
			for(var key in  req.body.trabajos){ user.trabajos[i] =  req.body.trabajos[i]; i++; }
			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000)
					return res.json({ success: false, message: 'Ya existe un usuario con ese login. '});
					else
					return res.send(err);
				}

				// return a message
				res.json({ success: true, message: 'User created!' });
			});
		}
		else
		return res.json({ success: false, message: 'Ingrese todos los campos.'});

	});
	//mover para que requiera token!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	apiRouter.post('/solicitarServicio',function(req, res) {
		var servicio = req.body;
		User.find(function(err, result) {
			if (err) throw err;
			var  i = 0;
			var users = result.slice(0,result.length); //[];
			for(; i < result.length;i++)
			{
				if( !result[i].ofertante){
					console.log('1');
					users.splice(users.indexOf(result[i]),1);

					continue;
				}
				if(servicio.ciudad ){
					if(servicio.ciudad != result[i].ciudad){
						users.splice(users.indexOf(result[i]),1);
						console.log('2');
						continue;
					}
				}
				if(servicio.alba && !result[i].alba)	{
					users.splice(users.indexOf(result[i]),1)
					console.log('3');
					continue;
				}
				if(servicio.carp && !result[i].carp){
					users.splice(users.indexOf(result[i]),1)
					console.log('4');
					continue;
				}
				if(servicio.elec && !result[i].elec){
					users.splice(users.indexOf(result[i]),1)
					console.log('5');

					continue;
				}
				if(servicio.jard && !result[i].jard){
					users.splice(users.indexOf(result[i]),1)
					console.log('6');
					continue;
				}
				if(servicio.pint && !result[i].pint){
					users.splice(users.indexOf(result[i]),1)
					console.log('7');
					continue;
				}
				if(servicio.plom && !result[i].plom){
					users.splice(users.indexOf(result[i]),1)
					console.log('8');
					continue;
				}

			}

			if (users.length == 0) {
				res.json({
					success: false,
					message: 'Lo sentimos, actualmente no tenemos un fixer que puedan hacer esos trabajos.'
				});
			}
			else if (users){
				IdServicio.find(function(err2, result2){
					if(err2) throw err2;
					var nuevoServ = new Servicio();
					nuevoServ.alba = req.body.alba;
					nuevoServ.carp = req.body.carp;
					nuevoServ.elec = req.body.elec;
					nuevoServ.jard = req.body.jard;
					nuevoServ.pint = req.body.pint;
					nuevoServ.plom = req.body.plom;
					nuevoServ.ciudad = req.body.ciudad;
					nuevoServ.descripcion = req.body.descripcion;
					nuevoServ.direccion = req.body.direccion;
					nuevoServ.trabajos = req.body.trabajos;
					nuevoServ.cliente = req.body.cliente;
					nuevoServ.precio = 0;
					nuevoServ.detalleCot = '';
					nuevoServ.estado = 'Esperando respuesta del fixer';
					if(result2.length === 0) {
						var idServicio = new IdServicio();
						idServicio.id = 0;
						idServicio.save(function (err3){
							if (err3) {
								console.log(err3);
							}
							else{
								nuevoServ.id = 0;
								nuevoServ.save(function(err4){
									if (err4) {
										console.log(err4);
									}
									else{
										return res.json({
											success: true,
											message: 'Fixers encontrados',
											fixers: users,
											servicioId:0
										});
									}
								})
							}
						})
					}else{
						var idAntiguo = result2[0];
						idAntiguo.id = idAntiguo.id+1;
						idAntiguo.save(function(err5){
							if(err5){
								console.log(err5);
							}else{
								nuevoServ.id = idAntiguo.id;
								nuevoServ.save(function(err6){
									if (err6) {
										console.log(err6);
									}
									else{
										return res.json({
											success: true,
											message: 'Fixers encontrados',
											fixers: users,
											servicioId: idAntiguo.id
										});
									}
								})
							}
						})
					}


				})

			}
		});
	});
	apiRouter.post('/terminarServicio', function(req, res) {
		Servicio.update({id:req.body.id}, {estado:'terminado'},function(err, numberAffected, rawResponse){
			return	res.json({
				success: true,
				message: 'Servicio terminado'
			});
		});

	});
	apiRouter.post('/rechazarServicio', function(req, res) {
		Servicio.update({id:req.body.id}, {estado:'rechazado'},function(err, numberAffected, rawResponse){
			return	res.json({
				success: true,
				message: 'Servicio terminado'
			});
		});

	});

	apiRouter.post('/iniciarServicio', function(req, res) {
		Servicio.update({id:req.body.id}, {estado:'Activo'},function(err, numberAffected, rawResponse){
			return	res.json({
				success: true,
				message: 'Servicio activado'
			});
		});

	});
	apiRouter.post('/enviarCotizacion', function(req, res) {
		Servicio.update({id:req.body.id}, {precio:req.body.precio, detalleCot:req.body.detalleCot, estado:'Esperando respuesta del cliente'},function(err, numberAffected, rawResponse){
			return	res.json({
				success: true,
				message: 'Servicio confirmado'
			});
		});

	});
	apiRouter.post('/confirmarServicio', function(req, res) {
		Servicio.update({id:req.body.id}, {cliente:req.body.cliente, ofertante:req.body.ofertante},function(err, numberAffected, rawResponse){
			return	res.json({
				success: true,
				message: 'Cotizacion enviada'
			});
		});

	});
	apiRouter.get('/serviciosActivoPorOfertante/:user_id', function(req, res) {

		Servicio.find(function(err,results){
			var respuesta = [];
			for (var i = 0; i < results.length ; i++){
				if(results[i].ofertante)
				if(results[i].ofertante._id === req.params.user_id && results[i].estado ==='Activo')
					 respuesta.push(results[i]);
			}
			return res.json({success:true, servicios:respuesta});
		});
	});
	apiRouter.get('/serviciosActivoPorCliente/:user_id', function(req, res) {
		Servicio.find(function(err,results){
			var respuesta = [];

			for (var i = 0; i < results.length  ; i++){
				if(results[i].cliente)
				if(results[i].cliente._id === req.params.user_id && results[i].estado ==='Activo')
					 respuesta.push(results[i]);
			}

			return res.json({success:true, servicios:respuesta});
		});
		});
	apiRouter.get('/serviciosEsperaPorCliente/:user_id', function(req, res) {
		Servicio.find(function(err,results){
			var respuesta = [];

			for (var i = 0; i < results.length  ; i++){
				if(results[i].cliente)
				if(results[i].cliente._id === req.params.user_id && results[i].estado ==='Esperando respuesta del cliente')
					 respuesta.push(results[i]);
			}

			return res.json({success:true, servicios:respuesta});
		});
	});

	apiRouter.get('/serviciosEsperaPorOfertante/:user_id', function(req, res) {

		Servicio.find(function(err,results){
			var respuesta = [];
			for (var i = 0; i < results.length ; i++){
				if(results[i].ofertante)
				if(results[i].ofertante._id === req.params.user_id && results[i].estado ==='Esperando respuesta del fixer')
					 respuesta.push(results[i]);
			}
			console.log(respuesta);
			return res.json({success:true, servicios:respuesta});
		});


	});
	apiRouter.get('/serviciosEsperaPorCliente/:user_id', function(req, res) {
		Servicio.find(function(err,results){
			var respuesta = [];

			for (var i = 0; i < results.length  ; i++){
				if(results[i].cliente)
				if(results[i].cliente._id === req.params.user_id && results[i].estado ==='Esperando respuesta del cliente')
					 respuesta.push(results[i]);
			}

			return res.json({success:true, servicios:respuesta});
		});


	});
	apiRouter.get('/serviciosActivoPorOfertante/:user_id', function(req, res) {

		Servicio.find(function(err,results){
			var respuesta = [];
			for (var i = 0; i < results.length; i++){
				if(results[i].ofertante)
				if(results[i].ofertante._id === req.params.user_id && results[i].estado ==='Activo')
					 respuesta.push(results[i]);
			}
			return res.json({success:true, servicios:respuesta});
		});


	});
	apiRouter.get('/serviciosActivoPorCliente/:user_id', function(req, res) {

		Servicio.find(function(err,results){
			var respuesta = [];
			for (var i = 0; i < results.length ; i++){
				if(results[i].cliente)
				if(results[i].cliente._id === req.params.user_id && results[i].estado ==='Activo')
					 respuesta.push(results[i]);
			}
			return res.json({success:true, servicios:respuesta});
		});


	});
	apiRouter.get('/serviciosTerminadoPorOfertante/:user_id', function(req, res) {

		Servicio.find(function(err,results){
			var respuesta = [];
			for (var i = 0; i < results.length ; i++){
				if(results[i].ofertante)
				if(results[i].ofertante._id === req.params.user_id && results[i].estado ==='terminado')
					 respuesta.push(results[i]);
			}
			return res.json({success:true, servicios:respuesta});
		});


	});
	apiRouter.get('/serviciosTerminadoPorCliente/:user_id', function(req, res) {

		Servicio.find(function(err,results){
			var respuesta = [];
			for (var i = 0; i < results.length ; i++){
				if(results[i].cliente)
				if(results[i].cliente._id === req.params.user_id && results[i].estado ==='terminado')
					 respuesta.push(results[i]);
			}
			return res.json({success:true, servicios:respuesta});
		});


	});
	apiRouter.get('/servicio/:service_id', function(req, res) {
		Servicio.findById(req.params.service_id, function(err, servicio) {
			if (err) return res.send(err);

			res.json(servicio);
		});


	});

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {

		// find the user
		User.findOne({
			username: req.body.username
		}).select('_id name username password ofertante perfil estrellas').exec(function(err, user) {
			if (err) throw err;

			// no user with that username was found
			if (!user) {
				res.json({
					success: false,
					message: 'El nombre de usuario no existe.'
				});
			} else if (user) {

				// check if password matches
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success: false,
						message: 'Contraseña incorrecta'
					});
				} else {

					// if user is found and password is right
					// create a token
					var token = jwt.sign({
						_id: user.id,
						name: user.name,
						username: user.username,
						perfil: user.perfil,
						estrellas:user.estrellas
					}, superSecret, {
						expiresIn: '24h' // expires in 24 hours
					});
					// return the information including token as JSON
					res.json({
						success: true,
						message: 'Enjoy your token!',
						token: token,
						ofertante: user.ofertante
					});
				}

			}

		});
	});

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');

		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		// decode token
		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, superSecret, function(err, decoded) {
				if (err)
				return res.json({ success: false, message: 'Failed to authenticate token.' });
				else
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
			});

		} else {

			// if there is no token
			// return an HTTP response of 403 (access forbidden) and an failed message
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			});

		}

		next(); // make sure we go to the next routes and don't stop here
	});

	// test route to make sure everything is working
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });
	});
	apiRouter.get('/me', function(req, res) {
		return res.send(req.decoded);
	});

	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')



	// get all the users (accessed at GET http://localhost:8080/api/users)
	.get(function(req, res) {
		User.find(function(err, users) {
			if (err) return res.send(err);

			// return the users
			res.json(users);
		});
	});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')
	// get the user with that id
	.get(function(req, res) {

		User.findById(req.params.user_id, function(err, user) {
			if (err) return res.send(err);
			// return that user
			res.json(user);
		});
	})

	// update the user with this id
	.put(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {

			if (err) return res.send(err);

			// set the new user information if it exists in the request
			if (req.body.name) user.name = req.body.name;
			if (req.body.username) user.username = req.body.username;
			if (req.body.password) user.password = req.body.password;

			// save the user
			user.save(function(err) {
				if (err)return res.send(err);

				// return a message
				res.json({ message: 'User updated!' });
			});

		});
	})

	// delete the user with this id
	.delete(function(req, res) {
		User.remove({
			_id: req.params.user_id
		}, function(err, user) {
			if (err)return  res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});



	apiRouter.get('/referencias/:user_username', function(req, res) {
		Referencia.find(function(err, result) {
			if (err) throw err;
			var  i = 0;
			var referencias = [];
			for(; i < result.length;i++)
			{
				if(result[i].fixerUsername ===	req.params.user_username)
				referencias.push(result[i]);
			}

			if (referencias.length == 0) {
				res.json({
					success: false,
					message: 'Lo sentimos, no hay referencias para ese Fixer.'
				});
			}
			else if (referencias){
				res.json({
					success: true,
					message: 'referencias encontrados',
					referencias: referencias
				});
			}
		});
	});



	apiRouter.post('/referencias/', function(req, res) {
		var referencia = new Referencia();		// create a new instance of the User model
		referencia.estrellas = req.body.ref.estrellas;  // set the users name (comes from the request)
		referencia.fixerUsername = req.body.ref.fixerUsername;  // set the users username (comes from the request)
		referencia.texto = req.body.ref.texto;  // set the users password (comes from the request)
		referencia.cliente = req.body.ref.cliente;
		referencia.save(function(err) {
			if (err) {
				console.log(err);
				return res.send(err);
			}else{
				User.findById(req.body.fixerId, function (err, user) {
					if (err) return handleError(err);
					user.estrellas = 	parseInt( ( ( parseInt(req.body.ref.estrellas,10)+(user.estrellas*user.votos ) )/(user.votos+1)), 10)
					user.votos = user.votos +1;
					user.trabajos = user.trabajos.concat(req.body.trabajos);
					user.save(function (err, updatedUser) {
						if (err) return handleError(err);
						res.json({ success: true, message: 'Referencia creada!' });
					});
				});}
			});
		});


		return apiRouter;
	};
