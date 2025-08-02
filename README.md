# 🌱 CleanChain 

> A decentralized platform that lets anyone clean dirty areas, prove it with geo-tagged evidence, and earn crypto rewards.

---

## Problem Statement

### The Environmental Crisis
- **Global waste pollution** is reaching critical levels, with over 2 billion tons of municipal solid waste generated annually
- **Lack of incentives** for individuals to participate in cleanup activities
- **No transparent verification** system for environmental impact tracking
- **Limited community engagement** in environmental conservation efforts

### Why This Matters??
- **Immediate impact**: Every cleanup directly improves local environments
- **Scalable solution**: Blockchain technology enables global participation
- **Economic incentives**: Token rewards encourage sustainable behavior
- **Community building**: Creates a network of environmental stewards

---

## Solution / What It Does

CleanChain is a decentralized platform that incentivizes environmental cleanup through blockchain-based verification and token rewards. Users can claim cleanup locations, submit photographic proof of their work, and earn ECO tokens upon community verification. The platform combines GPS tracking, photo verification, and community voting to create a transparent, gamified environmental impact system.

---

## Team Members:
- Jash Bohare (Team Lead, Backend, Blockchain) <br>
   -> Linkedin: https://www.linkedin.com/in/jash-bohare/

- Jaineel Lakhia (Frontend and Integration)  <br>
   -> Linkedin: https://www.linkedin.com/in/jaineel-lakhia1/

---

## Tech Stack

### **Frontend**
- **React.js** - Modern UI framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Router** - Client-side routing

### **Backend**
- **Node.js** - Server runtime
- **Express.js** - Web application framework
- **Firebase** - Database and authentication
- **Firestore** - NoSQL cloud database
- **Firebase Storage** - File upload and storage

### **Blockchain**
- **Ethereum** - Smart contract platform
- **Sepolia Testnet** - Development network
- **Solidity** - Smart contract language
- **Hardhat** - Development environment
- **Web3.js** - Ethereum JavaScript API

### **APIs & Services**
- **Google Maps API** - Interactive mapping
- **Firebase Admin SDK** - Backend services
- **MetaMask** - Wallet integration
- **IPFS** - Decentralized file storage (planned)

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control
- **npm** - Package management

---

## Core Workflow:
1. **Discover** → Users find nearby cleanup locations on an interactive map
2. **Claim** → Reserve a location within 15km radius
3. **Clean** → Perform the cleanup and document with before/after photos
4. **Verify** → Community votes on the quality and completion of work
5. **Reward** → Earn ECO tokens for verified cleanups

---

## Key Features

### **Interactive Map System**
- Real-time location discovery
- GPS-based proximity verification
- Before/after photo documentation
- Status tracking for all locations

### **Gamified Rewards**
- ECO token rewards for verified cleanups
- Community voting system
- Achievement tracking
- Environmental impact metrics

### **Community-Driven Verification**
- Peer-to-peer voting system
- Transparent verification process
- Quality control through community consensus
- Anti-gaming mechanisms

### **Personal Dashboard**
- Track cleanup history
- View earned tokens
- Monitor environmental impact
- Manage profile information

### **Modern Web Application**
- Responsive design for all devices
- Intuitive user interface
- Real-time updates
- Professional animations and effects

### **Blockchain Integration**
- MetaMask wallet connection
- Smart contract token distribution
- Transparent transaction history
- Decentralized verification

---
<img width="1599" height="767" alt="Screenshot 2025-07-31 170518" src="https://github.com/user-attachments/assets/ee027ef7-fea9-4af2-bd84-51f81885ba9c" />
<img width="1599" height="764" alt="Screenshot 2025-07-31 170713" src="https://github.com/user-attachments/assets/87f39651-cb29-4b4a-97b1-cc4506db79e4" />
<img width="1599" height="767" alt="Screenshot 2025-07-31 170738" src="https://github.com/user-attachments/assets/fda4b776-4327-4109-bbdb-ec1e27cd3afb" />
<img width="1577" height="753" alt="Screenshot 2025-07-31 170811" src="https://github.com/user-attachments/assets/c6e5b79d-b694-4387-a61d-cb90133714de" />

---

## Demo & Deliverables

- **Demo Video Link:** https://youtu.be/8OnX9XjZ4_A

---

## How to Run Project Locally??

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MetaMask** browser extension
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/CleanChain-V2.git
cd CleanChain-V2
```

### Step 2: Install Dependencies

#### Frontend Setup
```bash
cd frontend
npm install
```

#### Backend Setup
```bash
cd ../backend
npm install
```

#### Blockchain Setup
```bash
cd ../blockchain
npm install
```

### Step 3: Environment Configuration

#### Frontend Environment
Create `frontend/.env`:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_BACKEND_URL=http://localhost:3001
```

#### Backend Environment
Create `backend/.env`:
```env
PORT=3001
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

### Step 4: Firebase Setup
1. Create a new Firebase project
2. Enable Firestore Database
3. Enable Firebase Storage
4. Generate service account key
5. Update backend environment variables

### Step 5: Google Maps API
1. Create Google Cloud project
2. Enable Maps JavaScript API
3. Generate API key
4. Add to frontend environment

### Step 6: Deploy Smart Contracts
```bash
cd blockchain
npx hardhat compile
npx hardhat deploy --network sepolia
```

### Step 7: Start Development Servers

#### Backend Server
```bash
cd backend
npm start
```

#### Frontend Development Server
```bash
cd frontend
npm run dev
```

### Step 8: Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

### Step 9: Connect Wallet
1. Install MetaMask browser extension
2. Connect to Sepolia testnet
3. Get some test ETH from a faucet
4. Connect wallet to the application

---

## Future Enhancements

### Planned Features
- **Mobile App** - Native iOS/Android applications
- **AI Verification** - Automated photo analysis
- **NFT Badges** - Achievement-based collectibles
- **Leaderboards** - Community competition
- **Partnerships** - Corporate cleanup programs
- **Carbon Credits** - Environmental impact monetization

### Technical Improvements
- **Layer 2 Scaling** - Polygon or Arbitrum integration
- **IPFS Storage** - Decentralized file storage
- **DAO Governance** - Community-driven platform decisions
- **Cross-chain Support** - Multi-blockchain compatibility

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Ethereum Foundation** - For blockchain infrastructure
- **Firebase** - For backend services
- **Google Maps** - For location services
- **Open Source Community** - For amazing tools and libraries

---

**Made with ❤️ for a cleaner planet**
