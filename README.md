# CleanChain 🌱
**Earn ECO tokens for verified waste cleanups - Transparent, on-chain environmental impact tracking**

## 🚨 Problem Statement

### The Environmental Crisis
- **Global waste pollution** is reaching critical levels, with over 2 billion tons of municipal solid waste generated annually
- **Lack of incentives** for individuals to participate in cleanup activities
- **No transparent verification** system for environmental impact tracking
- **Limited community engagement** in environmental conservation efforts

### Why This Matters
- **Immediate impact**: Every cleanup directly improves local environments
- **Scalable solution**: Blockchain technology enables global participation
- **Economic incentives**: Token rewards encourage sustainable behavior
- **Community building**: Creates a network of environmental stewards

## 💡 Solution / What It Does

CleanChain is a decentralized platform that incentivizes environmental cleanup through blockchain-based verification and token rewards. Users can claim cleanup locations, submit photographic proof of their work, and earn ECO tokens upon community verification. The platform combines GPS tracking, photo verification, and community voting to create a transparent, gamified environmental impact system.

### Core Workflow:
1. **Discover** → Users find nearby cleanup locations on an interactive map
2. **Claim** → Reserve a location within 15km radius
3. **Clean** → Perform the cleanup and document with before/after photos
4. **Verify** → Community votes on the quality and completion of work
5. **Reward** → Earn ECO tokens for verified cleanups

## 🔄 Simple User Flow

```
Connect Wallet → Complete Profile → Browse Map → Claim Location → 
Upload Photos → Community Votes → Earn Tokens → Track Impact
```

### Detailed User Journey:

1. **Onboarding**
   - Connect MetaMask wallet
   - Complete profile with email and username
   - Navigate to interactive map

2. **Location Discovery**
   - View cleanup locations on map
   - Check distance (must be within 15km)
   - Review location details and potential rewards

3. **Cleanup Process**
   - Claim a location (becomes unavailable to others)
   - Perform the cleanup
   - Upload before/after photos as proof

4. **Verification & Rewards**
   - Community members vote on cleanup quality
   - Successful verifications earn ECO tokens
   - Track environmental impact in dashboard

## ✨ Key Features

### 🗺️ **Interactive Map System**
- Real-time location discovery
- GPS-based proximity verification
- Before/after photo documentation
- Status tracking for all locations

### 🏆 **Gamified Rewards**
- ECO token rewards for verified cleanups
- Community voting system
- Achievement tracking
- Environmental impact metrics

### 👥 **Community-Driven Verification**
- Peer-to-peer voting system
- Transparent verification process
- Quality control through community consensus
- Anti-gaming mechanisms

### 📊 **Personal Dashboard**
- Track cleanup history
- View earned tokens
- Monitor environmental impact
- Manage profile information

### 🎨 **Modern Web Application**
- Responsive design for all devices
- Intuitive user interface
- Real-time updates
- Professional animations and effects

### 🔐 **Blockchain Integration**
- MetaMask wallet connection
- Smart contract token distribution
- Transparent transaction history
- Decentralized verification

## 🛠️ Tech Stack

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

## 🚀 How to Run Project Locally

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

## 📁 Project Structure

```
CleanChain-V2/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API integration
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── backend/                 # Node.js server
│   ├── controllers/        # Request handlers
│   ├── routes/            # API routes
│   ├── firebase/          # Firebase configuration
│   └── utils/             # Server utilities
├── blockchain/             # Smart contracts
│   ├── contracts/         # Solidity contracts
│   ├── scripts/           # Deployment scripts
│   └── hardhat.config.js  # Hardhat configuration
└── README.md              # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/connect` - Connect wallet
- `POST /api/auth/verify` - Verify wallet signature

### Locations
- `GET /api/locations` - Get all cleanup locations
- `POST /api/locations/claim` - Claim a location
- `POST /api/locations/upload` - Upload cleanup photos
- `PUT /api/locations/:id/status` - Update location status

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/locations` - Get user's claimed locations

### Voting
- `POST /api/vote` - Submit vote on cleanup
- `GET /api/vote/consensus` - Check voting consensus

## 🎯 Future Enhancements

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

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ethereum Foundation** - For blockchain infrastructure
- **Firebase** - For backend services
- **Google Maps** - For location services
- **Open Source Community** - For amazing tools and libraries

## 📞 Support

- **Email**: support@cleanchain.io
- **Discord**: [CleanChain Community](https://discord.gg/cleanchain)
- **Twitter**: [@CleanChainApp](https://twitter.com/CleanChainApp)

---

**Made with ❤️ for a cleaner planet**
