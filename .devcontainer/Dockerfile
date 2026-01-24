FROM node:22-bookworm

# Install sudo and other utilities
RUN apt-get update && apt-get install -y sudo \
		libnspr4 \
		libnss3 \
		libdbus-1-3 \
		libatk1.0-0 \
		libatk-bridge2.0-0 \
		libcups2 \
		libxkbcommon0 \
		libatspi2.0-0 \
		libxcomposite1 \
		libxdamage1 \
		libxfixes3 \
		libxrandr2 \
		libgbm1 \
		libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Create vscode user with sudo privileges
RUN usermod -l vscode -d /home/vscode -m node \
    && groupmod -n vscode node \
    && echo "vscode ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode

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

# Prepare pnpm as the vscode user
USER vscode
RUN curl -fsSL https://gist.githubusercontent.com/DIO0550/dcc09dc9d2dcefceb9b0cda183e7ef8e/raw/pnpm-safe-chain-setup.sh | bash
# RUN corepack prepare pnpm@10 --activate
# USER root

# # Configure pnpm
# RUN pnpm config set --global minimumReleaseAge 7200

# # Configure npm
# RUN npm config set ignore-scripts true

# # Copy .npmrc to the vscode user's home directory
# COPY .npmrc /home/vscode/.npmrc
# RUN chown vscode:vscode /home/vscode/.npmrc

# # Install Safe-Chain as vscode user
# USER vscode
# RUN curl -fsSL https://github.com/AikidoSec/safe-chain/releases/latest/download/install-safe-chain.sh | sh
