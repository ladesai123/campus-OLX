# 🎓 Campus OLX - University Marketplace Platform

<div align="center">

![Campus OLX Logo](https://via.placeholder.com/200x100/2563eb/ffffff?text=Campus+OLX)

**Save Money. Save the Planet. 🌱**

*The official marketplace for university students - Get great deals on used items from students you trust, or give your old gear a new life.*

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.12-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

</div>

---

## 🌟 Overview

**Campus OLX** is a modern, eco-friendly marketplace designed specifically for university students. Our platform enables students to buy and sell used items within their campus community, promoting sustainability while helping students save money and reduce waste.

### 🎯 Mission
To create a trusted, university-verified marketplace that makes buying and selling between students safe, easy, and environmentally conscious.

### 💡 Key Value Proposition
- **💰 Save Money**: Get quality items at student-friendly prices
- **🌍 Environmental Impact**: Track and celebrate CO₂ savings from reusing items
- **🔒 Trust & Security**: University ID verification ensures safe transactions
- **💬 Direct Communication**: Built-in chat system for seamless buyer-seller interaction

---

## ✨ Features

### 🛍️ **Marketplace Core**
- **Product Listings**: Easy-to-use interface for listing items with photos and descriptions
- **Smart Search & Filter**: Find exactly what you need quickly
- **Category Organization**: Books, Electronics, Furniture, Clothing, and more
- **Real-time Updates**: Live inventory and pricing updates

### 👥 **Community Features**
- **University Verification**: Secure authentication with university email
- **Student Profiles**: Build trust with verified student profiles
- **Connection Requests**: Safe way to initiate buyer-seller conversations
- **Rating System**: Community-driven trust and reputation building

### 💬 **Communication Hub**
- **Integrated Chat**: Direct messaging between buyers and sellers
- **Real-time Notifications**: Stay updated on messages and requests
- **Online Status**: See when other students are available to chat
- **Message History**: Keep track of all your conversations

### 🌱 **Environmental Impact**
- **CO₂ Savings Tracker**: See your environmental impact in real-time
- **Sustainability Metrics**: Track items reused and waste diverted
- **Green Badges**: Earn recognition for sustainable choices
- **Impact Dashboard**: Visualize your contribution to campus sustainability

### 🔐 **Security & Trust**
- **University Email Verification**: Only verified students can participate
- **Secure Authentication**: Powered by Supabase authentication
- **Report System**: Community moderation and safety features
- **Privacy Controls**: Manage what information you share

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **University email address** for registration

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ladesai123/campus-OLX.git
   cd campus-OLX/campus-olx
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` and start exploring!

---

## 🏗️ Technical Architecture

### **Frontend Stack**
- **⚛️ React 19.1.1**: Modern React with latest features and hooks
- **⚡ Vite 7.1.2**: Lightning-fast build tool and dev server
- **🎨 Tailwind CSS 4.1.12**: Utility-first CSS framework for rapid UI development
- **🛣️ React Router DOM**: Client-side routing for single-page application

### **Backend & Services**
- **🚀 Supabase**: 
  - Authentication and user management
  - PostgreSQL database for data storage
  - Real-time subscriptions for live updates
  - Row Level Security (RLS) for data protection

### **Key Dependencies**
```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1", 
  "react-router-dom": "^7.8.2",
  "@supabase/supabase-js": "^2.56.0",
  "@tailwindcss/vite": "^4.1.12"
}
```

### **Project Structure**
```
campus-olx/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Auth.jsx       # Authentication component
│   │   └── Home.jsx       # Landing page component
│   ├── pages/             # Page-level components
│   │   └── Signup.jsx     # User registration page
│   ├── assets/            # Static assets (images, icons)
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── supabaseClient.js  # Supabase configuration
├── public/                # Public static files
├── package.json           # Project dependencies and scripts
└── README.md             # This file
```

---

## 🎮 User Journey

### **New User Experience**
1. **🔗 Landing Page**: Discover Campus OLX and its benefits
2. **✍️ Registration**: Sign up with university email
3. **📧 Verification**: Confirm email to activate account
4. **🏠 Onboarding**: Quick tour of features and how to get started

### **Selling Journey**
1. **📸 List Item**: Upload photos and add detailed descriptions
2. **💰 Set Price**: Price competitively based on similar listings
3. **📬 Receive Requests**: Get connection requests from interested buyers
4. **💬 Chat**: Communicate directly with potential buyers
5. **🤝 Complete Sale**: Finalize transaction details

### **Buying Journey**
1. **🔍 Browse/Search**: Find items using search or category filters
2. **📋 View Details**: Check photos, descriptions, and seller profiles
3. **📞 Connect**: Send connection request to seller
4. **💬 Negotiate**: Chat to discuss price, condition, and meeting details
5. **✅ Purchase**: Complete transaction safely

---

## 🌍 Environmental Impact

Campus OLX is committed to sustainability and reducing campus waste:

### **Impact Metrics**
- 📊 **Real-time Tracking**: Monitor CO₂ savings from each transaction
- 📈 **Community Dashboard**: See collective campus environmental impact  
- 🏆 **Achievements**: Unlock green badges for sustainable actions
- 📱 **Impact Sharing**: Share your environmental contributions

### **Sustainability Features**
- **♻️ Waste Reduction**: Keep items out of landfills by extending their lifecycle
- **🌱 Carbon Footprint**: Calculate and display CO₂ savings from reused items
- **🎯 Goals**: Set and track personal and campus sustainability goals
- **📚 Education**: Learn about the environmental impact of consumption

---

## 🛠️ Development

### **Available Scripts**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### **Code Quality**
- **ESLint**: Configured with React and modern JavaScript rules
- **Prettier**: Code formatting (add your own configuration)
- **Git Hooks**: Pre-commit hooks for code quality (to be implemented)

### **Responsive Design**
- **📱 Mobile First**: Optimized for mobile devices
- **💻 Desktop Ready**: Fully functional on desktop browsers
- **🎨 Tailwind Classes**: Utility-first responsive design system

---

## 🤝 Contributing

We welcome contributions from the student community! Here's how you can help:

### **Ways to Contribute**
- 🐛 **Bug Reports**: Found an issue? Let us know!
- 💡 **Feature Requests**: Have ideas for new features?
- 🔧 **Code Contributions**: Submit pull requests with improvements
- 📝 **Documentation**: Help improve our documentation
- 🎨 **Design**: Contribute to UI/UX improvements

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### **Code Standards**
- Follow existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes across different devices
- Ensure accessibility standards are met

---

## 📋 Roadmap

### **Phase 1: Core Platform** ✅
- [x] User authentication and profiles
- [x] Basic marketplace functionality
- [x] Chat system
- [x] Environmental impact tracking

### **Phase 2: Enhanced Features** 🚧
- [ ] Advanced search and filters
- [ ] Rating and review system
- [ ] Mobile app development
- [ ] Payment integration
- [ ] Wishlist functionality

### **Phase 3: Community Growth** 📅
- [ ] Multi-university expansion
- [ ] Student organization partnerships
- [ ] Campus pickup locations
- [ ] Seasonal campaigns (textbook exchanges, etc.)
- [ ] Gamification and rewards

### **Phase 4: Advanced Platform** 🔮
- [ ] AI-powered recommendations
- [ ] Price suggestion algorithms
- [ ] Advanced analytics dashboard
- [ ] Integration with university systems
- [ ] Sustainability certification program

---

## ❓ FAQ

<details>
<summary><strong>Who can use Campus OLX?</strong></summary>
<br>
Currently, Campus OLX is available to verified university students with valid university email addresses. We're working on expanding to more universities.
</details>

<details>
<summary><strong>Is Campus OLX free to use?</strong></summary>
<br>
Yes! Campus OLX is completely free for students. We believe in making sustainable shopping accessible to everyone.
</details>

<details>
<summary><strong>How do payments work?</strong></summary>
<br>
Currently, payments are handled directly between buyers and sellers. We're working on integrating secure payment processing in future updates.
</details>

<details>
<summary><strong>How is my environmental impact calculated?</strong></summary>
<br>
We use industry-standard carbon footprint calculations based on item categories, materials, and manufacturing impact to estimate CO₂ savings from reused items.
</details>

<details>
<summary><strong>What if I have an issue with a transaction?</strong></summary>
<br>
Contact our support team through the app or report the issue. We have community guidelines and moderation systems to ensure safe transactions.
</details>

---

## 📞 Support & Contact

- **🐛 Bug Reports**: [GitHub Issues](https://github.com/ladesai123/campus-OLX/issues)
- **💡 Feature Requests**: [GitHub Discussions](https://github.com/ladesai123/campus-OLX/discussions)
- **📧 Email Support**: contact@campusolx.com
- **📱 Social Media**: Follow us for updates and tips

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **🎓 University Community**: For inspiring and supporting sustainable campus initiatives
- **🌱 Environmental Organizations**: For guidance on sustainability metrics
- **👥 Student Beta Testers**: For valuable feedback and testing
- **🛠️ Open Source Community**: For the amazing tools and libraries that make this possible

---

<div align="center">

**Made with ❤️ by students, for students**

*Campus OLX - A project for students, by students.*

⭐ **Star this repo** if you find it helpful! ⭐

</div>
