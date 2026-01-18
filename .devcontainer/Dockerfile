FROM node:22-bookworm

# Install sudo and other utilities
RUN apt-get update && apt-get install -y sudo \
    && rm -rf /var/lib/apt/lists/*

RUN type -p wget >/dev/null || (sudo apt update && sudo apt install wget -y) \
	&& sudo mkdir -p -m 755 /etc/apt/keyrings \
	&& out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
	&& cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
	&& sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
	&& sudo mkdir -p -m 755 /etc/apt/sources.list.d \
	&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
	&& sudo apt update \
	&& sudo apt install gh -y \
    && rm -rf /var/lib/apt/lists/*

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
