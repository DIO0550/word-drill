FROM node:22-bookworm

# Setup pnpm environment
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable pnpm (as root for system-wide access)
RUN corepack enable

# Prepare pnpm as the node user
USER node
RUN corepack prepare pnpm@10 --activate
USER root

# Configure pnpm
RUN pnpm config set --global minimumReleaseAge 7200

# Configure npm
RUN npm config set ignore-scripts true

# Copy .npmrc to the node user's home directory
COPY .npmrc /home/node/.npmrc
RUN chown node:node /home/node/.npmrc

# Install Safe-Chain as node user
USER node
RUN curl -fsSL https://github.com/AikidoSec/safe-chain/releases/latest/download/install-safe-chain.sh | sh
