FROM node:22-bookworm

# Enable pnpm and install latest version
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install Safe-Chain
# Using the native installation script as requested
RUN curl -fsSL https://github.com/AikidoSec/safe-chain/releases/latest/download/install-safe-chain.sh | sh

# Copy .npmrc to the node user's home directory
COPY .npmrc /home/node/.npmrc
RUN chown node:node /home/node/.npmrc
