# Prod is linux/amd64. Without this, a build on Apple Silicon is arm64 and
# Docker 20.10.17 exits with "exec format error".
FROM --platform=linux/amd64 node:24-bookworm
EXPOSE 3000

# Fonts for PDF text. Chrome and its shared libraries come from Puppeteer.
# apt lists stay available until Puppeteer runs `apt-get satisfy` for Chrome.
ENV LANG=en_US.UTF-8

WORKDIR /app

COPY package*.json ./

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		ca-certificates \
		curl \
		dbus \
		dbus-x11 \
		fonts-freefont-ttf \
		fonts-ipafont-gothic \
		fonts-kacst \
		fonts-khmeros \
		fonts-thai-tlwg \
		fonts-wqy-zenhei \
	&& npm ci \
	&& npx puppeteer browsers install chrome --install-deps \
	&& rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["npm", "run", "start"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD curl -f localhost:3000/ping || exit 1
