<h1 align="center">
  <br>
  <img src="./app/favicon.ico" alt="SOLfolio" width="100">
  <br>
  SOLfolio
  <br>
</h1>
<h4 align="center">A powerful digital asset management platform built on the <a href="https://solana.com" target="_blank">Solana</a> blockchain.</h4>

<p align="center">
  <a href="https://solfolio.nyc">
    <img src="https://img.shields.io/badge/website-solfolio.nyc-blue?style=flat-square" alt="Website">
  </a>
  <a href="https://discord.gg/solfolio">
    <img src="https://img.shields.io/discord/1234567890?color=7289da&label=discord&logo=discord&logoColor=white&style=flat-square" alt="Discord">
  </a>
  <a href="https://twitter.com/solfolio">
    <img src="https://img.shields.io/twitter/follow/solfolio?style=social" alt="Twitter">
  </a>
</p>

## 🌐 Live Demo

Experience SOLfolio at [solfolio.nyc](https://solfolio.nyc)

## 🎥 Video Demo

Watch SOLfolio in action:

[![SOLfolio](https://markdown-videos-api.jorgenkh.no/youtube/eGUXIDN6O2A)](https://youtu.be/eGUXIDN6O2A)

## ✨ Key Features

- **💎 Asset Creation & Management**
  - Create and manage digital assets on Solana
  - Configure asset properties including supply, decimals, and security features
  - Real-time asset monitoring and analytics
- **🏦 Treasury Management**
  - Multi-vault support for asset segregation
  - Detailed transaction history
  - Advanced access controls
- **🛡️ Security Features**

  - Authorization controls
  - Asset freeze capabilities
  - Clawback functionality
  - Regulatory compliance tools

- **📊 Analytics Dashboard**

  - Real-time asset performance metrics
  - Supply distribution visualization
  - Transaction volume tracking
  - Holder analytics

- **👛 Wallet Integration**
  - Support for multiple Solana wallets
  - Seamless transaction signing
  - Real-time balance updates

## 🚀 Getting Started

To run SOLfolio locally, you'll need Node.js 18+ and npm installed. Follow these steps:

```bash
# Clone the repository
git clone https://github.com/solfolio/solfolio.git

# Navigate to the project directory
cd solfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

## 💻 Development

### Project Structure

```
solfolio/
├── app/                    # Next.js pages and components
├── components/            # Reusable UI components
├── contract/             # Solana smart contracts
├── lib/                  # Utility functions and services
├── public/              # Static assets
└── styles/              # Global styles and themes
```

### Smart Contracts

The Solana program (smart contract) is located in the `contract/` directory. To build and deploy the contract:

```bash
# Build the program
cargo build-bpf

# Deploy to devnet
solana program deploy target/deploy/solana_asset_manager.so
```

## 🌟 Tech Stack

- **Frontend** 🎨

  - Next.js 13 (App Router)
  - React 18
  - Tailwind CSS
  - shadcn/ui
  - Recharts

- **Blockchain** ⛓️

  - Solana Web3.js
  - Anchor Framework
  - SPL Token Program

- **Development** 🛠️
  - TypeScript
  - ESLint
  - Prettier

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.
