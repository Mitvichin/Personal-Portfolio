# --------- Stage 1: Build frontend ----------
    FROM node:20.10.0 AS builder

    WORKDIR /app
    
    # Copy and install frontend deps
    COPY frontend/package.json frontend/package-lock.json ./frontend/
    RUN cd frontend && npm install
    
    # Copy the rest of the frontend
    COPY frontend ./frontend
    
    # Build the frontend
    RUN cd frontend && npm run build
    
    # --------- Stage 2: Setup backend ----------
    FROM node:20.10.0 AS server
    
    WORKDIR /app
    
    # Copy backend files
    COPY backend/package.json backend/package-lock.json ./
    RUN npm install
    
    COPY backend .
    
    # Copy built frontend into backend's public folder
    COPY --from=builder /app/frontend/dist ./public
    
    # Expose API port
    EXPOSE 3000
    
    # Start the server
    CMD ["node", "index.js"]