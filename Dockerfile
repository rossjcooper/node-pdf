FROM node:12
EXPOSE 3000

RUN apt-get update \
	&& apt-get install -y wget gnupg \
	&& wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
	&& sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
	&& apt-get update \
	&& apt-get install -y curl google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
	--no-install-recommends \
	&& rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome-stable"

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

CMD npm run start

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD curl -f localhost:3000/ping || exit 1