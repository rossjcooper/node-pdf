var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer')

/* GET home page. */
router.get('/ping', function(req, res, next) {
	res.send('OK');
});

router.all('/export/pdf', async (req, res) => {
	// Express 5 leaves req.body undefined when the request has no body.
	const body = req.body || {};
	let browser;
	try {
		browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
		const page = await browser.newPage()
		if (req.query.url !== undefined) {
			try {
				await page.goto(req.query.url)
			} catch (err) {
				res.status(400)
				res.send(JSON.stringify({ error: 'Failed to open URL' }))
				return;
			}
		} else if (body.html !== undefined) {
			try {
				await page.setContent(body.html);
			} catch (err) {
				res.status(400)
				res.send(JSON.stringify({ error: 'Failed to parse HTML' }))
				return;
			}
		} else {
			res.status(400)
			res.send(JSON.stringify({ error: 'URL or HTML data missing' }))
			return;
		}
		let footerTemplate = req.query.footer_html || body.footer_html || '<div/>';
		let headerTemplate = req.query.header_html || body.header_html || '<div/>';
		if (req.query.show_page_numbers || body.show_page_numbers) {
			footerTemplate = '<div style="position: relative; z-index: 9999; width: 100%; font-size: 10px; margin-right: .75cm; text-align: right;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>';
		}
		const buffer = await page.pdf({
			format: 'A4',
			printBackground: true,
			displayHeaderFooter: footerTemplate || headerTemplate ? true : false,
			headerTemplate: headerTemplate,
			footerTemplate: footerTemplate,
		})
		res.type('application/pdf')
		res.send(buffer)
	} catch (err) {
		console.error(err);
		if (!res.headersSent) {
			res.status(500)
			res.send(JSON.stringify({ error: 'Failed to render PDF' }))
		}
	} finally {
		if (browser) {
			await browser.close()
		}
	}
})

module.exports = router;
