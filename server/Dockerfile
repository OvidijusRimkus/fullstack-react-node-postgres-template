# Naudojam Node.js image.
# 22 versija tinka, nes pas tave terminale irgi rodo Node v24,
# bet Docker su 22 LTS bus stabilesnis šablonui.
FROM node:22-alpine

# Sukuriam darbo aplanką konteineryje.
WORKDIR /app

# Pirmiausia kopijuojam package failus.
# Taip Docker cache veiks geriau:
# jeigu keisi tik src kodą, npm install nereikės vykdyti iš naujo.
COPY package*.json ./

# Įrašom dependencies.
RUN npm install

# Nukopijuojam likusį backend kodą.
COPY . .

# Backend klausysis 3000 porto.
EXPOSE 3000

# Default komanda.
# Compose faile vis tiek naudojam command: npm run dev,
# bet čia paliekam fallback.
CMD ["npm", "run", "dev"]