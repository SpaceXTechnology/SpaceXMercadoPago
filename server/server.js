const express = require("express");
const app = express();
const cors = require("cors");
const mercadopago = require("mercadopago");
const path = require("path");
mercadopago.configure({
	access_token: "TEST-6139007830727122-100218-b8409c7789d749a14a260d3aac67ad9f-656146647",
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../cliente")));
app.use(cors());

app.get("/", function (req, res) {
	const filepath = path.resolve(__dirname,"..","cliente" ,"indexorder.html");
	res.sendFile(filepath);
});

app.post("/create_preference", (req, res) => {

	let preference = {
		items: [
			{
				title: req.body.description,
				unit_price: Number(req.body.price),
				quantity: Number(req.body.quantity),
			}
		],
		back_urls: {
			"success": "http://localhost:8080/feedback",//a donde va cuando da ok
			"failure": "http://localhost:8080/feedback",//a donde va cuando da error
			"pending": "http://localhost:8080/feedback"//a donde va cuando da pendiente??? pago pendiente
		},
		auto_return: "approved",
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({
				id: response.body.id
			});
		}).catch(function (error) {
			console.log(error);
		});
});

app.get('/feedback', function (req, res) {
	res.json({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id
	});
});

app.listen(8080, () => {
	console.log("The server is now running on Port 8080");
});
