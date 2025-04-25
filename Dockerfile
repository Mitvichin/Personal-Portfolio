    FROM node:20.10.0 AS builder

    ARG VITE_API_BASE_URL

    ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

    WORKDIR /app
    
    COPY frontend ./frontend
    RUN cd frontend && npm install
    
    RUN cd frontend && npm run build
    
    FROM node:20.10.0 AS server
    
    WORKDIR /app
    
    COPY backend .
    RUN npm install
    
    COPY --from=builder /app/frontend/dist ./public
    
    EXPOSE 3000
    
    CMD ["node", "index.js"]