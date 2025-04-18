## 🌐 Live Demo

Check out the deployed app here: To be added soon! <!-- [ReNewTrade](https://v0-p2-p-renewable-energy-proj-git-41c696-chiragtolanis-projects.vercel.app) -->

# ⚡ ReNewTrade 🌿

**Empowering Households to Monetize Surplus Solar Energy Through AI-Powered Energy Trading and Carbon Credits**

ReNewTrade is an innovative decentralized platform that enables individuals generating **surplus solar energy at home** to trade their excess energy with **factories and companies**, while also earning **carbon credits** and **monetary rewards**. Our platform uses an **AI negotiation agent** to help users find the best offers, automate deals, and log everything transparently on a portal — with future blockchain integration planned (Currently the blockchain is setup locally)


---

## 🚀 Key Features

- 🔋 **Surplus Solar Energy Trading**  
  Homeowners with excess solar energy can securely sell it to verified industrial buyers.

- 🧠 **AI-Powered Deal Assistant**  
  Our AI agent helps users:
  - Discover the **best buyers and prices**
  - **Negotiate** automatically
  - Conclude the **deal upon user confirmation**

- 👛 **Wallet Integration**  
  Users securely connect their crypto wallets to receive payments and interact with the platform.

- 💸 **Payment Automation**  
  Once a deal is confirmed, the **payment interface is triggered**, completing the transaction seamlessly.

- 🧾 **Transaction Logging**  
  All activity — from offers to payments — is logged and viewable in the user’s portal.

- 🌱 **Carbon Credit Generation**  
  Users automatically earn carbon points for each transaction, which can be **redeemed for cash or rewards** *(feature coming soon)*.

- 🔗 **Blockchain Integration** *(Upcoming)*  
  Currently the blockchain is setup locally but it is catered to be implemented with smart contracts on the Ethereum Sepolia testnet for secure and tamper-proof transactions.

---

## 🧭 Step-by-Step User Journey

1. **Sign In to the Portal**  
   The user logs into the ReNewTrade portal with secure credentials.

2. **Connect Wallet**  
   The user connects their crypto wallet (e.g., MetaMask) to initiate trading and receive payments.

3. **AI Finds the Best Offers**  
   The AI scans the platform and suggests optimal buyers based on real-time pricing, demand, and geography.

4. **Negotiate & Confirm**  
   The AI negotiates automatically. The user reviews the final offer and **confirms the deal**.

5. **Trigger Payment Interface**  
   Once confirmed, the platform initiates a secure payment via the connected wallet.

6. **Log Transaction & Award Carbon Points**  
   The payment and trade details are saved in the user's portal. The platform automatically calculates and awards carbon credits.

7. **Track & Redeem (Coming Soon)**  
   Users can track their energy trades, earnings, and carbon points — which will later be redeemable for cash or partner rewards.

---

## 🏗️ Tech Stack

| Component        | Technology                          |
|------------------|--------------------------------------|
| Frontend         | React.js, Tailwind CSS               |
| Backend/API      | Node.js, Express                     |
| AI Agent         | Gemini API / Custom LLM Logic        |
| Blockchain       | Solidity, Hardhat, Sepolia Testnet   |
| Database         | Firestore (NoSQL)                    |
| Wallet Support   | Ethers.js / Wagmi                    |

---

## 🛠️ Getting Started
### Private key for Metamask Wallet -93ee9b410a6790482c619ddcba97188f8afd190febef59c7acbe4a3e389b9479

### 1. Clone the Repository

```bash
git clone https://github.com/chiragtolani/ReNewTrade.git
cd ReNewTrade
```

### 2. Install Dependencies

```bash
npm install
```
### 3. Start the Development Server

```bash
npm run dev
```
### 4.Setup Environment Variables
```bash
FIREBASE_API_KEY=your_key
GEMINI_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

## 📦 Project Structure
```graphql
ReNewTrade/
├── components/          # Reusable React components
├── pages/               # Next.js route pages
├── public/              # Static assets
├── utils/               # AI logic and helpers
├── smart-contract/      # Solidity contracts and Hardhat setup
└── styles/              # Tailwind CSS and global styles
```

## 📸 Demo 

<div style="display: flex; overflow-x: auto; gap: 20px; padding: 10px;">

  <div style="text-align: center;">
    <h4>Login</h4>
    <img src="./Demo/1.jpg" width="700"/>
  </div>

  <div style="text-align: center;">
    <h4>Wallet Connection</h4>
    <img src="Demo/2.jpg" width="700"/>
  </div>

  <div style="text-align: center;">
    <h4>Initiating the AI Agent Coversation </h4>
    <img src="Demo/3.jpg" width="700"/>
  </div>

  <div style="text-align: center;">
    <h4> AI Agent confirming the deal </h4>
    <img src="Demo/4.jpg" width="700"/>
  </div>

  <div style="text-align: center;">
    <h4>Verfiy the Deal suggested by the Agent and Initiate Sell</h4>
    <img src="Demo/5.jpg" width="700"/>
  </div>

  <div style="text-align: center;">
    <h4>Confirm the blockchain transaction</h4>
    <img src="Demo/6.jpg" width="700"/>
  </div>

  <div style="text-align: center;">
    <h4>The transaction is processed in Sepolia</h4>
    <img src="Demo/7.jpg" width="700"/>
  </div>

  <div style="text-align: center;">
    <h4>Transaction Log Entry</h4>
    <img src="Demo/8.jpg" width="700"/>
  </div>

  <div style="text-align: center;">
    <h4>The transaction is visible in the Metamask log as well</h4>
    <img src="Demo/9.jpg" width="700"/>
  </div>

</div>


### 📌 Roadmap

✅ User portal and login flow

✅ AI agent suggestion and deal automation

✅ Wallet connection and payment trigger

✅ Transaction and carbon point logging

🔄 Carbon credit redemption system (Coming Soon)

🔄 Smart contract deployment on Sepolia (In Progress)

🔄 MetaMask / wallet integrations

🔄 Public beta release

## 🤝 Contributing

We welcome contributions from the community!

```bash
git checkout -b feature/YourFeatureName
git commit -m "Add Your Feature"
git push origin feature/YourFeatureName



