FROM node:12
EXPOSE 3000

RUN apt-get update \
	&& apt-get install -y wget gnupg \
	&& wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
	&& sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
	&& apt-get update \
	&& apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
	--no-install-recommends \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci \
	&& groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
	&& mkdir -p /home/pptruser/Downloads \
	&& chown -R pptruser:pptruser /home/pptruser
COPY . .
USER pptruser

CMD ["google-chrome-stable"]