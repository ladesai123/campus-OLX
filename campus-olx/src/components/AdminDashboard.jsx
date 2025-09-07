import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { EmailService } from '../utils/emailService';

const AdminDashboard = ({ onClose }) => {
  const [pendingItems, setPendingItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adminMessage, setAdminMessage] = useState('');

  // Mock data for demo - in production, fetch from Supabase
  const mockPendingItems = [
    {
      id: 1,
      name: 'MacBook Pro 2021',
      price: 1200,
      category: 'Electronics',
      description: 'Excellent condition, includes charger',
      seller_email: 'john@university.edu',
      seller_name: 'John Doe',
      image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      created_at: new Date().toISOString(),
      ai_analysis: {
        authenticity_score: 0.95,
        content_appropriate: true,
        quality_score: 8.7,
        suggested_category: 'Electronics'
      }
    },
    {
      id: 2,
      name: 'Organic Chemistry Textbook',
      price: 89,
      category: 'Books',
      description: 'Used for one semester, great condition',
      seller_email: 'sarah@university.edu',
      seller_name: 'Sarah Smith',
      image_url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
      created_at: new Date().toISOString(),
      ai_analysis: {
        authenticity_score: 0.88,
        content_appropriate: true,
        quality_score: 7.5,
        suggested_category: 'Books'
      }
    }
  ];

  const mockUsers = [
    {
      id: 1,
      email: 'john@university.edu',
      name: 'John Doe',
      verified: true,
      joined: '2024-01-15',
      items_sold: 5,
      items_bought: 3,
      rating: 4.8
    },
    {
      id: 2,
      email: 'sarah@university.edu',
      name: 'Sarah Smith',
      verified: false,
      joined: '2024-02-20',
      items_sold: 2,
      items_bought: 7,
      rating: 4.6
    }
  ];

  useEffect(() => {
    setPendingItems(mockPendingItems);
    setUsers(mockUsers);
  }, []);

  const handleApproveItem = async (item) => {
    setLoading(true);
    try {
      // In production: Update item status in Supabase
      console.log('Approving item:', item.id);
      
      // Send email notification to seller
      await EmailService.sendItemStatusNotification(
        item.seller_email,
        item.name,
        true,
        adminMessage || 'Your item has been approved and is now live!'
      );
      
      // Remove from pending list
      setPendingItems(prev => prev.filter(i => i.id !== item.id));
      setSelectedItem(null);
      setAdminMessage('');
      
      alert('Item approved successfully!');
    } catch (error) {
      console.error('Error approving item:', error);
      alert('Failed to approve item');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectItem = async (item) => {
    if (!adminMessage.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setLoading(true);
    try {
      // In production: Update item status in Supabase
      console.log('Rejecting item:', item.id);
      
      // Send email notification to seller
      await EmailService.sendItemStatusNotification(
        item.seller_email,
        item.name,
        false,
        adminMessage
      );
      
      // Remove from pending list
      setPendingItems(prev => prev.filter(i => i.id !== item.id));
      setSelectedItem(null);
      setAdminMessage('');
      
      alert('Item rejected and user notified');
    } catch (error) {
      console.error('Error rejecting item:', error);
      alert('Failed to reject item');
    } finally {
      setLoading(false);
    }
  };

  const handleSendUserMessage = async (user, message) => {
    setLoading(true);
    try {
      // Send custom message to user
      const emailData = {
        to: user.email,
        subject: 'Message from CampusOLX Admin',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Message from CampusOLX Admin</h2>
            <p>Hi ${user.name},</p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">
              <p>${message}</p>
            </div>
            <p>Best regards,<br>CampusOLX Admin Team</p>
          </div>
        `
      };
      
      console.log('Admin message would be sent:', emailData);
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">CampusOLX Admin Dashboard</h1>
            <p className="opacity-90">Manage items, users, and platform quality</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab('pending')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                selectedTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Items ({pendingItems.length})
            </button>
            <button
              onClick={() => setSelectedTab('users')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                selectedTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setSelectedTab('analytics')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                selectedTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex h-full">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedTab === 'pending' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Items Pending Approval</h2>
                {pendingItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">✅</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-500">No items pending approval at the moment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {pendingItems.map(item => (
                      <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex space-x-4">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-green-600 font-medium">${item.price}</p>
                            <p className="text-sm text-gray-600">{item.category}</p>
                            <p className="text-sm text-gray-500 mt-1">by {item.seller_name}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">AI Analysis:</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Authenticity: {(item.ai_analysis.authenticity_score * 100).toFixed(0)}%</div>
                            <div>Quality: {item.ai_analysis.quality_score}/10</div>
                            <div>Content: {item.ai_analysis.content_appropriate ? '✅ Safe' : '❌ Review'}</div>
                            <div>Category: {item.ai_analysis.suggested_category}</div>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'users' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.verified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.verified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>Sold: {user.items_sold} | Bought: {user.items_bought}</div>
                            <div className="text-xs text-gray-500">Rating: {user.rating}⭐</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                const message = prompt('Enter message to send to user:');
                                if (message) handleSendUserMessage(user, message);
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Send Message
                            </button>
                            {!user.verified && (
                              <button className="text-green-600 hover:text-green-900">
                                Verify
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Platform Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900">Active Users</h3>
                    <p className="text-3xl font-bold text-blue-600">1,247</p>
                    <p className="text-sm text-blue-600">+12% this week</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900">Items Listed</h3>
                    <p className="text-3xl font-bold text-green-600">3,421</p>
                    <p className="text-sm text-green-600">+8% this week</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-900">Transactions</h3>
                    <p className="text-3xl font-bold text-purple-600">892</p>
                    <p className="text-sm text-purple-600">+15% this week</p>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">New user registration: jane@university.edu</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Item listed: "Gaming Chair" by mike@university.edu</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Transaction completed: "Physics Textbook" - $45</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Item Detail Panel */}
          {selectedItem && (
            <div className="w-96 border-l border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Review Item</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <img
                src={selectedItem.image_url}
                alt={selectedItem.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              
              <div className="space-y-3 mb-6">
                <div>
                  <h4 className="font-semibold">{selectedItem.name}</h4>
                  <p className="text-green-600 font-medium">${selectedItem.price}</p>
                </div>
                <p className="text-sm text-gray-600">{selectedItem.description}</p>
                <div className="text-sm">
                  <p><strong>Seller:</strong> {selectedItem.seller_name}</p>
                  <p><strong>Email:</strong> {selectedItem.seller_email}</p>
                  <p><strong>Category:</strong> {selectedItem.category}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Message (optional)
                </label>
                <textarea
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  placeholder="Add a message for the seller..."
                  className="w-full h-20 border border-gray-300 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleApproveItem(selectedItem)}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  ✅ Approve Item
                </button>
                <button
                  onClick={() => handleRejectItem(selectedItem)}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  ❌ Reject Item
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;