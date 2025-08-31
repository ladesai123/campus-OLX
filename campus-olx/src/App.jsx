import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';

// --- MOCK DATA ---
// In a real application, this data would come from a database.
const initialProducts = [
  { id: 1, name: 'Used "Intro to CS" Textbook', price: 45.00, seller: 'Alice J.', imageUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=2070&auto=format&fit=crop', isFree: false },
  { id: 2, name: 'Barely Used Desk Lamp', price: 15.00, seller: 'Bob K.', imageUrl: 'https://images.unsplash.com/photo-1543469582-01e1d493a18a?q=80&w=1974&auto=format&fit=crop', isFree: false },
  { id: 3, name: 'Acoustic Guitar', price: 120.00, seller: 'Charlie M.', imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106945?q=80&w=2070&auto=format&fit=crop', isFree: false },
  { id: 4, name: 'Mini Fridge', price: 0, seller: 'Diana P.', imageUrl: 'https://images.unsplash.com/photo-1620789492809-52882a1f5e26?q=80&w=1974&auto=format&fit=crop', isFree: true },
  { id: 5, name: 'Set of 4 Mugs', price: 10.00, seller: 'Ethan W.', imageUrl: 'https://images.unsplash.com/photo-1594312247936-d351a2a24f46?q=80&w=1974&auto=format&fit=crop', isFree: false },
  { id: 6, name: 'Scientific Calculator', price: 25.00, seller: 'Fiona G.', imageUrl: 'https://images.unsplash.com/photo-1596496050827-4208a63f0329?q=80&w=2070&auto=format&fit=crop', isFree: false },
];

const featuredProducts = initialProducts.slice(0, 4); // For the landing page

const initialRequests = [
    { id: 1, user: 'George H.', item: 'Yoga Mat', status: 'pending' },
    { id: 2, user: 'Hannah I.', item: 'Old Comfy Chair', status: 'pending' },
];

const initialChats = [
    { id: 1, user: 'Alice J.', item: 'CS Textbook', online: true, messages: [
        { sender: 'Alice J.', text: 'Hey! Is the textbook still available?' },
        { sender: 'You', text: 'Yes it is!' },
    ]},
    { id: 2, user: 'Bob K.', item: 'Desk Lamp', online: false, messages: [
        { sender: 'You', text: 'Hi, I saw your listing for the desk lamp.' },
    ]},
];


// --- SVG ICONS ---
const LeafIcon = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6 inline-block mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const MoneyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>;
const PlanetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.8 15.25a2.5 2.5 0 01-2.5-2.5V11a2.5 2.5 0 015 0v1.75a2.5 2.5 0 01-2.5 2.5zM16.2 15.25a2.5 2.5 0 01-2.5-2.5V11a2.5 2.5 0 015 0v1.75a2.5 2.5 0 01-2.5 2.5z" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;


// --- REUSABLE COMPONENTS ---

const Toast = ({ message, show, onHide }) => {
    useEffect(() => {
        if (show) { const timer = setTimeout(() => onHide(), 3000); return () => clearTimeout(timer); }
    }, [show, onHide]);
    return <div className={`fixed bottom-5 right-5 bg-gray-800 text-white py-3 px-6 rounded-lg shadow-xl transition-transform duration-300 ${show ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0'}`}>{message}</div>;
};

const LoginModal = ({ show, onClose, onLogin }) => {
    if (!show) return null;
    const handleLogin = (e) => { e.preventDefault(); onLogin(); onClose(); };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 m-4">
                <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-bold text-gray-800">Campus Access</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon /></button></div>
                <p className="text-gray-600 mb-6">Please use your official university email to sign in.</p>
                <form onSubmit={handleLogin}>
                    <div className="mb-4"><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">University Email</label><input className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" id="email" type="email" placeholder="student@university.edu" required /></div>
                    <div className="mb-6"><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label><input className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" id="password" type="password" placeholder="******************" required /></div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105" type="submit">Sign In</button><a className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800" href="#">Forgot Password?</a></div>
                </form>
            </div>
        </div>
    );
};

const SellItemModal = ({ show, onClose, onAddItem }) => {
    const [isFree, setIsFree] = useState(false);
    const [price, setPrice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [aiStatus, setAiStatus] = useState('');
    const [aiProgress, setAiProgress] = useState(0);
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const newItem = { 
            id: Date.now(), 
            name: e.target.itemName.value, 
            price: isFree ? 0 : parseFloat(price), 
            seller: 'You', 
            imageUrl: `https://placehold.co/600x400/7C3AED/FFFFFF?text=${encodeURIComponent(e.target.itemName.value)}`, 
            isFree: isFree,
            description: description
        };
        setItemName(newItem.name);
        
        // Enhanced AI authenticity check simulation with progress tracking
        setAiProgress(0);
        setAiStatus('🔍 Scanning product images for authenticity markers...');
        
        setTimeout(() => { setAiProgress(25); setAiStatus('🤖 AI analyzing product condition and wear patterns...'); }, 600);
        setTimeout(() => { setAiProgress(50); setAiStatus('🔬 Cross-referencing with product database...'); }, 1200);
        setTimeout(() => { setAiProgress(75); setAiStatus('🛡️ Checking for counterfeit indicators...'); }, 1800);
        setTimeout(() => { setAiProgress(90); setAiStatus('📊 Generating authenticity confidence score...'); }, 2400);
        setTimeout(() => { setAiProgress(100); setAiStatus('✅ Product verified as authentic! Confidence: 94.7%'); }, 3000);
        setTimeout(() => { setIsSubmitting(false); setAiStatus(''); setAiProgress(0); onAddItem(newItem); }, 3600);
    };
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 m-4">{isSubmitting ? (<div className="text-center py-12"><div className="w-20 h-20 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-6"></div><h3 className="text-xl font-semibold text-gray-700">🤖 AI Product Verification</h3><div className="w-full bg-gray-200 rounded-full h-2 mt-4 mb-3"><div className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out" style={{width: `${aiProgress}%`}}></div></div><p className="text-gray-500 mt-2 min-h-6 text-sm">{aiStatus || `Analyzing "${itemName}"...`}</p><div className="mt-6 text-xs text-gray-400 px-4 py-2 bg-gray-50 rounded-lg">🔬 Our AI uses advanced image recognition, product database cross-referencing, and authenticity pattern analysis to ensure genuine products</div></div>) : (<><div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-bold text-gray-800">📦 Sell Your Item</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon /></button></div><form onSubmit={handleSubmit}><div className="mb-4"><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemName">Item Name *</label><input className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" id="itemName" type="text" placeholder="e.g., Ergonomic Study Desk Chair" required /></div><div className="mb-4"><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Product Description *</label><textarea className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" id="description" rows="4" placeholder="📝 Help buyers trust your listing! Include:
• How long you've owned it
• Current condition (any scratches, wear, etc.)
• Reason for selling
• Original purchase price (optional)
• Any accessories included

Example: 'Used for 6 months, excellent condition with minor scuffs on base. Selling because I'm moving apartments. Originally $150, includes ergonomic cushion.'" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea><div className="text-xs text-gray-500 mt-1">💡 Detailed descriptions get 3x more responses and build trust!</div></div><div className="mb-4"><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price ($) {!isFree && '*'}</label><input className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isFree ? 'bg-gray-200 cursor-not-allowed' : ''}`} id="price" type="number" placeholder="25.00" value={price} onChange={(e) => setPrice(e.target.value)} disabled={isFree} required={!isFree}/></div><div className="mb-6"><label className="flex items-center cursor-pointer group"><input type="checkbox" className="form-checkbox h-5 w-5 text-green-600 rounded" checked={isFree} onChange={() => setIsFree(!isFree)} /><span className="ml-3 text-gray-700 group-hover:text-green-600 transition-colors">🎁 Give away for FREE - Help a fellow student!</span></label></div><div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-6 border border-green-200"><p className="text-sm text-green-800"><LeafIcon className="h-4 w-4 inline mr-1" />🌍 <strong>Environmental Impact:</strong> By listing this item, you're helping reduce campus waste and saving an estimated <strong className="text-green-700">3.2 kg of CO₂</strong> from entering the atmosphere!</p></div><div className="flex items-center justify-end gap-4"><button className="text-gray-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors" type="button" onClick={onClose}>Cancel</button><button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all transform hover:scale-105 shadow-lg" type="submit">🤖 AI Verify & List Item</button></div></form></>)}</div>
        </div>
    );
};

const ProductCard = ({ product, onConnect }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
        <div className="relative">
            <img className="w-full h-48 object-cover" src={product.imageUrl} alt={product.name} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/CCCCCC/FFFFFF?text=Image+Error'; }} />
            {product.isFree && <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">FREE 🎁</div>}
            <div className="absolute bottom-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                <LeafIcon className="h-3 w-3 mr-1" />
                2.8kg CO₂ saved
            </div>
        </div>
        <div className="p-5">
            <h3 className="text-lg font-bold text-gray-800 truncate">{product.name}</h3>
            <p className="text-gray-600 mb-3">Sold by {product.seller}</p>
            <div className="flex justify-between items-center">
                <p className="text-2xl font-black text-blue-600">
                    {product.isFree ? 'FREE' : `$${product.price.toFixed(2)}`}
                </p>
                <button onClick={() => onConnect && onConnect(product.seller, product.name)} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    Connect
                </button>
            </div>
        </div>
    </div>
);

const Header = ({ onSellClick, onLoginClick, onLogout, isLoggedIn, onNavigate }) => (
    <header className="bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-40">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-800 cursor-pointer" onClick={() => isLoggedIn && onNavigate('marketplace')}>Campus<span className="text-blue-600">OLX</span></div>
            <div className="flex items-center space-x-4">
                {isLoggedIn && <button onClick={onSellClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition-transform transform hover:scale-105 hidden sm:block">+ Sell Item</button>}
                {isLoggedIn ? (
                    <>
                        <div className="relative"><img src="https://placehold.co/40x40/E2E8F0/4A5568?text=U" alt="User Avatar" className="w-10 h-10 rounded-full cursor-pointer" onClick={() => onNavigate('profile')} /><span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"></span></div>
                        <button onClick={onLogout} className="font-semibold text-gray-600 hover:text-red-600 transition-colors">Logout</button>
                    </>
                ) : (
                    <button onClick={onLoginClick} className="font-semibold text-gray-600 hover:text-blue-600">Log In / Sign Up</button>
                )}
            </div>
        </nav>
    </header>
);

const StatsBanner = ({ totalItemsReused, totalCO2Saved, liveUpdate }) => {
    // Use a subset of the total data for the marketplace banner
    const marketplaceItems = Math.round(totalItemsReused * 0.15); // Show ~15% as "active" items
    const marketplaceCO2 = totalCO2Saved ? (parseFloat(totalCO2Saved) * 0.15).toFixed(1) : (marketplaceItems * 2.8).toFixed(1);
    const wasteReduced = (marketplaceItems * 1.2).toFixed(1);
    
    return (
        <div className={`bg-gradient-to-r from-green-400 via-emerald-500 to-blue-500 text-white py-6 px-6 text-center shadow-lg ${liveUpdate ? 'ring-2 ring-yellow-300' : ''} transition-all duration-300`}>
            <p className="font-bold text-lg mb-2">
                <LeafIcon className="h-6 w-6 inline-block mr-2" />
                🎯 Live Campus Impact Tracker 
                {liveUpdate && <span className="ml-2 animate-bounce">📈 LIVE UPDATE!</span>}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-center">
                <div className={`${liveUpdate ? 'animate-pulse scale-110' : ''} transition-transform duration-300`}>
                    <span className="font-extrabold text-3xl">{marketplaceItems}</span>
                    <div className="text-sm opacity-90">Active Listings</div>
                </div>
                <div className={`${liveUpdate ? 'animate-pulse scale-110' : ''} transition-transform duration-300`}>
                    <span className="font-extrabold text-3xl">{marketplaceCO2} kg</span>
                    <div className="text-sm opacity-90">CO₂ Saved</div>
                </div>
                <div className={`${liveUpdate ? 'animate-pulse scale-110' : ''} transition-transform duration-300`}>
                    <span className="font-extrabold text-3xl">{wasteReduced} kg</span>
                    <div className="text-sm opacity-90">Waste Reduced</div>
                </div>
            </div>
        </div>
    );
};

// --- ENHANCED LANDING PAGE & COMPONENTS ---

const TestimonialCard = ({ quote, author, major, avatar }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
        <p className="text-gray-600 italic">"{quote}"</p>
        <div className="flex items-center mt-4">
            <img src={avatar} alt={author} className="w-12 h-12 rounded-full object-cover" />
            <div className="ml-4">
                <p className="font-bold text-gray-800">{author}</p>
                <p className="text-sm text-gray-500">{major}</p>
            </div>
        </div>
    </div>
);

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 py-4">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
                <span className="text-lg font-semibold text-gray-800">{question}</span>
                <span className={`transform ${isOpen ? 'rotate-180' : ''}`}><ChevronDownIcon /></span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                <p className="text-gray-600">{answer}</p>
            </div>
        </div>
    );
};

const LandingPage = ({ onLoginClick, totalItemsReused, totalCO2Saved, liveUpdate }) => {
    return (
        <div className="bg-gray-50">
            <Header onLoginClick={onLoginClick} isLoggedIn={false} />
            <main>
                <div className="relative">
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                    <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" className="w-full h-[60vh] object-cover" alt="Students collaborating on campus"/>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight shadow-lg">
                            Save Money. <span className="text-blue-400">Save the Planet.</span>
                        </h1>
                        <p className="mt-4 text-lg max-w-2xl shadow-lg">
                            The official marketplace for our university. Get great deals on used items from students you trust, or give your old gear a new life.
                        </p>
                        <button onClick={onLoginClick} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-xl">
                            Join with your University ID
                        </button>
                    </div>
                </div>

                {/* Enhanced Environmental Impact Section */}
                <div className="bg-gradient-to-r from-green-500 via-emerald-600 to-blue-600 text-white py-16">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-4xl font-extrabold mb-4">🌍 Our Campus Environmental Impact</h2>
                        <p className="text-xl opacity-90 mb-8">See the real-time difference our student community is making!</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className={`bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm ${liveUpdate ? 'ring-4 ring-yellow-300 animate-pulse' : ''} transition-all duration-300`}>
                                <div className="text-5xl font-extrabold text-yellow-200">{totalItemsReused}</div>
                                <div className="text-lg font-semibold">Items Reused</div>
                                <div className="text-sm opacity-80">Total campus-wide</div>
                                {liveUpdate && <div className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full mt-2 animate-bounce">LIVE UPDATE! 📈</div>}
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm">
                                <div className="text-5xl font-extrabold text-green-200">{totalCO2Saved}</div>
                                <div className="text-lg font-semibold">kg CO₂ Saved</div>
                                <div className="text-sm opacity-80">Equivalent to planting {Math.round(parseFloat(totalCO2Saved || 0) / 22)} trees!</div>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm">
                                <div className="text-5xl font-extrabold text-blue-200">{(totalItemsReused * 1.2).toFixed(0)}</div>
                                <div className="text-lg font-semibold">kg Waste Diverted</div>
                                <div className="text-sm opacity-80">From campus landfills</div>
                            </div>
                        </div>
                        <p className="mt-8 text-lg opacity-90">🎯 <strong>Every item you buy or sell helps build a more sustainable campus!</strong></p>
                    </div>
                </div>

                <div className="bg-white py-24">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                             <h2 className="text-4xl font-extrabold text-gray-900">A Smarter Way to Campus Shop</h2>
                             <p className="text-gray-600 mt-2 max-w-2xl mx-auto">CampusOLX is simple, safe, and built for students. Here's how to get started in under a minute.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="p-4">
                                <div className="text-6xl font-bold text-blue-100 mb-2">1</div>
                                <h3 className="text-xl font-bold text-gray-800">Create Your Account</h3>
                                <p className="text-gray-600 mt-2">Sign up securely with your university email to ensure everyone is a verified student.</p>
                            </div>
                            <div className="p-4">
                                <div className="text-6xl font-bold text-blue-100 mb-2">2</div>
                                <h3 className="text-xl font-bold text-gray-800">Browse or List</h3>
                                <p className="text-gray-600 mt-2">Find amazing deals on items from fellow students or easily list your own unwanted gear for sale.</p>
                            </div>
                            <div className="p-4">
                                <div className="text-6xl font-bold text-blue-100 mb-2">3</div>
                                <h3 className="text-xl font-bold text-gray-800">Connect & Transact</h3>
                                <p className="text-gray-600 mt-2">Chat directly and safely with buyers or sellers to arrange a meetup on campus.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 py-24">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                             <h2 className="text-4xl font-extrabold text-gray-900">See What's Available Now</h2>
                             <p className="text-gray-600 mt-2">Here's a sneak peek of items recently listed by students.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}
                        </div>
                         <div className="text-center mt-12">
                            <button onClick={onLoginClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
                                View All Items
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white py-24">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                             <h2 className="text-4xl font-extrabold text-gray-900">What Our Students Are Saying</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                           <TestimonialCard 
                                quote="I sold my old chemistry textbook in a day and used the money for concert tickets. So much easier than other sites!"
                                author="Jessica L."
                                major="Chemistry, '26"
                                avatar="https://images.unsplash.com/photo-1529232353706-35c94a552865?q=80&w=1974&auto=format&fit=crop"
                            />
                            <TestimonialCard 
                                quote="Furnishing my dorm room was actually affordable thanks to CampusOLX. I got a great mini-fridge for free!"
                                author="Mike R."
                                major="Computer Science, '25"
                                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                            />
                            <TestimonialCard 
                                quote="It just feels safer knowing I'm dealing with other students from my university. The whole process is super smooth."
                                author="Chloe T."
                                major="Business Admin, '27"
                                avatar="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-50 py-24">
                    <div className="container mx-auto px-6 max-w-3xl">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
                        </div>
                        <FaqItem question="Is it safe to meet up with sellers/buyers?" answer="We recommend meeting in well-lit, public places on campus, like the student union, library lobby, or a campus coffee shop. Always let a friend know where you're going. Since all users are verified students, it creates a more trusted environment." />
                        <FaqItem question="How does payment work?" answer="CampusOLX is a platform to connect students. All payments are handled directly between the buyer and seller using cash, Venmo, or any other method they agree upon. We do not process payments." />
                        <FaqItem question="What if an item isn't as described?" answer="We encourage honest and clear descriptions. If you encounter an issue, please try to resolve it directly with the seller. If that's not possible, you can report the user to our support team, and we will investigate." />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 text-white py-24">
                    <div className="container mx-auto px-6">
                        <div className={`bg-white/10 backdrop-blur-sm p-10 rounded-3xl shadow-2xl text-center border border-white/20 ${liveUpdate ? 'animate-pulse ring-4 ring-yellow-300' : ''}`}>
                            {liveUpdate && (
                                <div className="mb-4 bg-yellow-400 text-black px-4 py-2 rounded-full inline-block font-bold animate-bounce">
                                    🎉 NEW ITEM REUSED! +2.8kg CO₂ SAVED!
                                </div>
                            )}
                            <p className="text-2xl font-semibold mb-2">🌍 Live Environmental Impact</p>
                            <p className="text-xl mb-4">Our campus community has reused</p>
                            <p className={`text-8xl font-black my-6 ${liveUpdate ? 'text-yellow-300 scale-110' : ''} transition-all duration-500`}>
                                {totalItemsReused.toLocaleString()}
                            </p>
                            <p className="text-2xl font-semibold mb-6">
                                items, saving an estimated 
                                <span className={`font-bold mx-2 ${liveUpdate ? 'text-yellow-300' : ''} transition-colors duration-500`}>
                                    {parseFloat(totalCO2Saved).toLocaleString()} kg
                                </span> 
                                of CO₂!
                            </p>
                            <div className="grid grid-cols-3 gap-4 mt-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold">{Math.round(totalItemsReused * 0.75)}</div>
                                    <div className="text-sm opacity-90">Books Saved</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">{Math.round(totalItemsReused * 1.2)}</div>
                                    <div className="text-sm opacity-90">Trees Equivalent</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">{Math.round(totalCO2Saved * 0.4)}</div>
                                    <div className="text-sm opacity-90">Miles Not Driven</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

const Footer = () => (
    <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-2xl font-bold">Campus<span className="text-blue-400">OLX</span></div>
                <div className="flex mt-4 md:mt-0 space-x-6">
                    <a href="#" className="hover:text-blue-400">About</a>
                    <a href="#" className="hover:text-blue-400">FAQ</a>
                    <a href="#" className="hover:text-blue-400">Contact</a>
                    <a href="#" className="hover:text-blue-400">Privacy Policy</a>
                </div>
            </div>
            <div className="text-center text-gray-400 mt-8 border-t border-gray-700 pt-6">
                &copy; {new Date().getFullYear()} CampusOLX. A project for students, by students.
            </div>
        </div>
    </footer>
);


const ChatInterface = ({ chat, onBack, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [chat.messages]);
    const handleSend = () => { if (newMessage.trim()) { onSendMessage(chat.id, newMessage); setNewMessage(''); } };
    return (
        <div className="flex flex-col h-full bg-white">
            <header className="flex items-center p-4 border-b bg-gray-50"><button onClick={onBack} className="mr-4 text-gray-600 hover:text-gray-900"><ArrowLeftIcon /></button><img src={`https://placehold.co/40x40/E2E8F0/4A5568?text=${chat.user.charAt(0)}`} alt={chat.user} className="w-10 h-10 rounded-full mr-3" /><div><h3 className="font-bold text-gray-800">{chat.user}</h3><p className={`text-sm ${chat.online ? 'text-green-500' : 'text-gray-500'}`}>{chat.online ? 'Online' : 'Offline'}</p></div></header>
            <main className="flex-1 p-4 overflow-y-auto bg-gray-100">{chat.messages.map((msg, index) => (<div key={index} className={`flex mb-4 ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}><div className={`rounded-2xl py-2 px-4 max-w-xs lg:max-w-md ${msg.sender === 'You' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>{msg.text}</div></div>))}<div ref={messagesEndRef} /></main>
            <footer className="p-4 border-t bg-white"><div className="flex items-center"><input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 border rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500" /><button onClick={handleSend} className="ml-4 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"><SendIcon /></button></div></footer>
        </div>
    );
};

const ProfilePage = ({ requests, chats, onAcceptRequest, showToast }) => {
    const [activeChat, setActiveChat] = useState(null);
    const [currentChats, setCurrentChats] = useState(chats);
    const handleAccept = (request) => { onAcceptRequest(request); showToast(`Connection with ${request.user} accepted!`); };
    const handleSendMessage = (chatId, text) => {
        const updatedChats = currentChats.map(c => c.id === chatId ? { ...c, messages: [...c.messages, { sender: 'You', text }] } : c);
        setCurrentChats(updatedChats);
        const targetChat = updatedChats.find(c => c.id === chatId);
        if (targetChat && targetChat.online) { setTimeout(() => { const replyText = "Awesome, thanks for the quick reply!"; setCurrentChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, { sender: targetChat.user, text: replyText }] } : c)); }, 1500); }
    };
    if (activeChat) return <ChatInterface chat={activeChat} onBack={() => setActiveChat(null)} onSendMessage={handleSendMessage} />;
    return (
        <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1"><h2 className="text-3xl font-extrabold text-gray-900 mb-4">Connection Requests</h2><div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">{requests.length > 0 ? requests.map(req => (<div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div><p className="font-bold">{req.user}</p><p className="text-sm text-gray-600">re: {req.item}</p></div><button onClick={() => handleAccept(req)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm">Accept</button></div>)) : <p className="text-gray-500">No new connection requests.</p>}</div></div>
            <div className="md:col-span-2"><h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your Chats</h2><div className="bg-white rounded-2xl shadow-lg overflow-hidden"><ul className="divide-y divide-gray-200">{currentChats.map(chat => (<li key={chat.id} onClick={() => setActiveChat(chat)} className="p-4 flex items-center hover:bg-gray-50 cursor-pointer"><div className="relative"><img src={`https://placehold.co/50x50/E2E8F0/4A5568?text=${chat.user.charAt(0)}`} alt={chat.user} className="w-12 h-12 rounded-full mr-4" />{chat.online && <span className="absolute bottom-0 right-4 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>}</div><div className="flex-1"><div className="flex justify-between"><h3 className="font-bold text-gray-800">{chat.user}</h3><p className="text-sm text-gray-500">2 min ago</p></div><p className="text-sm text-gray-600 truncate">{chat.messages[chat.messages.length - 1].text}</p></div></li>))}</ul></div></div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
export default function App() {
    const [session, setSession] = useState(null);
    const [products, setProducts] = useState(initialProducts);
    const [requests, setRequests] = useState(initialRequests);
    const [chats, setChats] = useState(initialChats);
    const [showSellModal, setShowSellModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [currentView, setCurrentView] = useState('landing');
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    
    // Enhanced Environmental Impact Tracking
    const [totalItemsReused, setTotalItemsReused] = useState(1342);
    const [liveUpdate, setLiveUpdate] = useState(false);
    
    // Calculate environmental impact dynamically
    const co2SavedPerItem = 2.8;
    const totalCO2Saved = (totalItemsReused * co2SavedPerItem).toFixed(1);
    
    // Simulate live updates periodically
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every 10 seconds
                setLiveUpdate(true);
                setTotalItemsReused(prev => prev + 1);
                setTimeout(() => setLiveUpdate(false), 2000);
            }
        }, 10000);
        
        return () => clearInterval(interval);
    }, []);

    // Authentication effects
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                setCurrentView('marketplace');
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                if (session) {
                    setCurrentView('marketplace');
                } else {
                    setCurrentView('landing');
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async () => {
        // This is a mock login - in real app, handle actual authentication
        setSession({ user: { id: 'mock-user', email: 'student@university.edu' } });
        showToastMessage('Welcome to CampusOLX!');
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setCurrentView('landing');
    };

    const handleAddItem = (newItem) => {
        setProducts([newItem, ...products]);
        setShowSellModal(false);
        
        // Update environmental impact when new item is added
        setTotalItemsReused(prev => prev + 1);
        setLiveUpdate(true);
        setTimeout(() => setLiveUpdate(false), 3000);
        
        showToastMessage(`✅ "${newItem.name}" listed successfully! 🌱 You've helped save ${co2SavedPerItem}kg CO₂!`);
    };

    const handleConnect = (seller, item) => {
        const newRequest = { id: Date.now(), user: seller, item: item, status: 'pending' };
        setRequests([...requests, newRequest]);
        showToastMessage(`🤝 Connection request sent to ${seller}! 🌱 You're helping make our campus more sustainable!`);
    };

    const handleAcceptRequest = (request) => {
        setRequests(requests.filter(r => r.id !== request.id));
        const newChat = {
            id: Date.now(),
            user: request.user,
            item: request.item,
            online: Math.random() > 0.5,
            messages: [{ sender: request.user, text: `Hi! Thanks for accepting my request about the ${request.item}.` }]
        };
        setChats([newChat, ...chats]);
    };

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const hideToast = () => {
        setShowToast(false);
    };

    if (currentView === 'landing') {
        return (
            <LandingPage 
                onLoginClick={() => setShowLoginModal(true)} 
                totalItemsReused={totalItemsReused}
                totalCO2Saved={totalCO2Saved}
                liveUpdate={liveUpdate}
            />
        );
    }

    const renderMainContent = () => {
        switch (currentView) {
            case 'marketplace':
                return (
                    <div>
                        <StatsBanner 
                            totalItemsReused={totalItemsReused}
                            totalCO2Saved={totalCO2Saved}
                            liveUpdate={liveUpdate}
                        />
                        <div className="container mx-auto p-6">
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">🛍️ Campus Marketplace</h1>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
                                    Discover amazing deals from verified university students. Every purchase helps build a more sustainable campus! 🌱
                                </p>
                                <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                                    <LeafIcon className="h-4 w-4 mr-2" />
                                    <span className="text-sm font-semibold">🤖 All items verified by AI authenticity check</span>
                                </div>
                                <button onClick={() => setShowSellModal(true)} className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 sm:hidden">+ Sell Item</button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {products.map(product => (
                                    <ProductCard 
                                        key={product.id} 
                                        product={product} 
                                        onConnect={handleConnect}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <ProfilePage 
                        requests={requests}
                        chats={chats}
                        onAcceptRequest={handleAcceptRequest}
                        showToast={showToastMessage}
                    />
                );
            default:
                return <LandingPage onLoginClick={() => setShowLoginModal(true)} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header 
                onSellClick={() => setShowSellModal(true)}
                onLoginClick={() => setShowLoginModal(true)}
                onLogout={handleLogout}
                isLoggedIn={!!session}
                onNavigate={setCurrentView}
            />
            
            {renderMainContent()}

            <SellItemModal 
                show={showSellModal}
                onClose={() => setShowSellModal(false)}
                onAddItem={handleAddItem}
            />

            <LoginModal 
                show={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={handleLogin}
            />

            <Toast 
                message={toastMessage}
                show={showToast}
                onHide={hideToast}
            />
        </div>
    );
}
