const express = require("express");
const cors = require("cors");
const { Client, Pool } = require("pg");
const app = express();
const port = 3001;

app.use(cors({ origin: "http://localhost:3001" }));

// Middleware to parse JSON request bodies
app.use(express.json());
var corsOptions = {
	origin: "http://localhost:3000",
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.get("/", async (req, res) => {
	try {
		const data = await connectDb({ query: "SELECT * FROM management.todos" });
		console.log({ data });
		res.status(200).json({ data });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "An error occurred while fetching data" });
	}
});

app.post("/saveTodo", async (req, res) => {
	try {
		console.log({ req: req.body });
		const body = req.body;
		const insertQuery = "INSERT INTO management.todos(todo,status) VALUES($1, $2) RETURNING *";
		const values = [body.todo, "open"];
		console.log({ values });

		await connectDb({ query: insertQuery, values });
		const data = await connectDb({ query: "SELECT * FROM management.todos" });

		res.status(200).json({ data });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "An error occurred while saving the todo" });
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

const connectDb = async ({ query = "", values = [] }) => {
	try {
		const client = new Pool({
			user: "postgres",
			host: "127.0.0.1",
			database: "docker_example",
			password: "root",
			port: 5432,
		});

		await client.connect();

		let result;

		if (query) {
			result = await client.query(query, values);
		}

		return result && result.rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
