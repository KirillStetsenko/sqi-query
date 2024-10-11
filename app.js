import express from 'express';
import handlebars from 'express-handlebars';
import mysql from 'mysql2/promise';

const app = express();

const hbs = handlebars.create({
	defaultLayout: 'main',
	extname: '.hbs',
});

const connection = await mysql.createConnection({
	host: 'localhost',
	user: 'Skiper',
	password: '123456',
	database: 'mybase',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/about', (req, res) => {
	res.render('about');
});

app.get('/results', async (req, res) => {
	let query = `SELECT * FROM users`;
	let [data] = await connection.query(query);
	res.render('results', { data: data });
});

app.get('/remove/:id', async (req, res) => {
	let id = Number(req.params.id);
	console.log(id);

	let query = `DELETE FROM users WHERE id=${id}`;
	let message = '';
	try {
		let [result] = await connection.query(query);
		message = `User with id ${id} is removed.`;
	} catch (err) {
		message = err.message;
	}
	res.render('remove', { message: message });
});

app.get('/show/:id', async (req, res) => {
	let id = req.params.id;
	let query = `SELECT * FROM users WHERE id = ${id}`;
	try {
		let [result] = await connection.query(query);
		console.log(result);

		res.render('show', { result: result });
	} catch (err) {
		console.log('Error', err);
	}
});

app.listen(3000, () => console.log('Server work!'));
