const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
const app = express();
const port = 3001;

app.use(cors({ origin: "http://localhost:3001" }));

var corsOptions = {
	origin: "http://localhost:3000",
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.get("/", cors(corsOptions), async (req, res) => {
	console.log(req?.headers, "tset");
	const data = await connectDb();
	console.log({ data });
	res.send({ data });
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

const connectDb = async () => {
	try {
		const client = new Client({
			user: "postgres",
			host: "127.0.0.1",
			database: "docker_example",
			password: "root",
			port: 5432,
		});

		await client.connect();
		const res = await client.query("SELECT * FROM management.todos");
		return res?.rows;
	} catch (error) {
		console.log(error);
	}
};
