var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer')

/* GET home page. */
router.get('/', function(req, res, next) {

});

router.get('/export/pdf', (req, res) => {
	(async () => {
		const browser = await puppeteer.launch()
		const page = await browser.newPage()
		await page.goto(req.query.url)
		const buffer = await page.pdf({
			format: 'A4',
			printBackground: true,
		})
		res.type('application/pdf')
		res.send(buffer)
		browser.close()
	})()
})

module.exports = router;
