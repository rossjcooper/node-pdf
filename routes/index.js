var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer')

/* GET home page. */
router.get('/ping', function(req, res, next) {
	res.send('OK');
});

router.all('/export/pdf', (req, res, next) => {
	(async () => {
		const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
		const page = await browser.newPage()
		if (req.query.url !== undefined) {
			try {
				await page.goto(req.query.url)
			} catch (err) {
				res.status(400)
				res.send(JSON.stringify({ error: 'Failed to open URL' }))
				browser.close();
				return;
			}
		}else if (req.body.html !== undefined) {
			try {
				await page.setContent(req.body.html);
			} catch (err) {
				res.status(400)
				res.send(JSON.stringify({ error: 'Failed to parse HTML' }))
				browser.close();
				return;
			}
		} else {
			res.status(400)
			res.send(JSON.stringify({ error: 'URL or HTML data missing' }))
			browser.close();
			return;
		}
		let footerTemplate = req.query.footer_html || '';
		if (req.query.show_page_numbers) {
			footerTemplate = '<div style="position: relative; z-index: 9999; width: 100%; font-size: 10px; margin-right: .75cm; text-align: right;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>';
		}
		const buffer = await page.pdf({
			format: 'A4',
			printBackground: true,
			displayHeaderFooter: footerTemplate ? true : false,
			footerTemplate: footerTemplate
		})
		res.type('application/pdf')
		res.send(buffer)
		browser.close()
	})()
})

module.exports = router;
