# Node PDF Export Server

This project creates a Node server that can export webpages to PDF using a URL or raw HTML passed to it.

## Quick Start

1. `npm install`
1. `npm run start`

## PDF from URL

Make a request to `http://localhost:3000/export/pdf?url=#urlHere#`

## PDF from HTML

Make a POST request to `http://localhost:3000/export/pdf` with JSON body:
```json
{
	"html": "<h1>Test</h1>"
}
```

## PDF Page Options


### Page Footer

You can set the footer HTML by passing it through the URL query parameter `?footer_html=Example Footer`

### Page Numbers
You can show page numbers using the following URL query parameter `?show_page_numbers=true`.

_Note: setting the `footer_html` option will override the page numbers._

## Docker

### Build docker image locally from source

```
docker build -t node-pdf .
```

### Running local docker image

```
docker run --name node-pdf -p 3000:3000 -it --rm node-pdf
```