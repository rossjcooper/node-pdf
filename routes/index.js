var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer')

/* GET home page. */
router.get('/', function(req, res, next) {

});

router.post('/export/pdf', (req, res) => {
	(async () => {
		const browser = await puppeteer.launch()
		const page = await browser.newPage()
		if (req.body.url !== undefined) {
			await page.goto(req.body.url)
		}else if (req.body.html !== undefined) {
			await page.setContent(req.body.html);
		}
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
