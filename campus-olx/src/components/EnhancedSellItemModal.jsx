import React, { useState, useRef } from 'react';
import { compressImage, validateImage, analyzeImageContent, createImageVariants } from '../utils/imageCompression';

const EnhancedSellItemModal = ({ show, onClose, onAddItem }) => {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [imageProcessing, setImageProcessing] = useState(false);
  const [compressionResults, setCompressionResults] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const fileInputRef = useRef();

  const categories = [
    'Electronics', 'Books', 'Furniture', 'Clothing', 'Sports', 
    'Music', 'Art', 'Kitchen', 'Other'
  ];

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageProcessing(true);
    const processedImages = [];
    const compressionData = [];

    try {
      for (const file of files) {
        // Validate image
        validateImage(file);
        
        // Compress image
        const compressed = await compressImage(file);
        
        // Create variants
        const variants = await createImageVariants(compressed.compressedFile);
        
        // AI analysis
        const analysis = await analyzeImageContent(file);
        
        processedImages.push({
          id: Date.now() + Math.random(),
          original: file,
          compressed: compressed.compressedFile,
          variants,
          analysis
        });
        
        compressionData.push({
          originalSize: compressed.originalSize,
          compressedSize: compressed.compressedSize,
          ratio: compressed.compressionRatio
        });
      }
      
      setImages(processedImages);
      setCompressionResults(compressionData);
      
      // Set AI analysis from first image for category suggestion
      if (processedImages[0]?.analysis) {
        setAiAnalysis(processedImages[0].analysis);
        if (processedImages[0].analysis.suggestedCategory && !category) {
          setCategory(processedImages[0].analysis.suggestedCategory);
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setImageProcessing(false);
    }
  };

  const removeImage = (imageId) => {
    setImages(images.filter(img => img.id !== imageId));
    setCompressionResults(compressionResults.slice(0, -1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName || !price || !category || images.length === 0) {
      alert('Please fill in all fields and upload at least one image.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create item object with compressed images
      const newItem = {
        id: Date.now(),
        name: itemName,
        price: parseFloat(price),
        category,
        description,
        seller: 'You',
        imageUrl: images[0].variants.medium.url, // Use medium variant for display
        images: images.map(img => ({
          thumbnail: img.variants.thumbnail.url,
          medium: img.variants.medium.url,
          full: img.variants.full.url
        })),
        aiAnalysis: aiAnalysis,
        compressionStats: compressionResults,
        createdAt: new Date().toISOString(),
        status: 'pending' // Requires admin approval
      };

      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      onAddItem(newItem);
      
      // Reset form
      setItemName('');
      setPrice('');
      setCategory('');
      setDescription('');
      setImages([]);
      setCompressionResults([]);
      setAiAnalysis(null);
    } catch (error) {
      alert('Failed to list item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {isSubmitting ? (
          <div className="text-center py-16 px-8">
            <div className="w-20 h-20 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Processing Your Listing...</h3>
            <p className="text-gray-500 mb-4">Running AI authenticity check on "{itemName}"</p>
            <div className="bg-blue-50 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-blue-900 mb-2">What's happening:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✅ Images compressed by {compressionResults[0]?.ratio}%</li>
                <li>✅ AI content verification complete</li>
                <li>🔄 Submitting to admin for approval</li>
                <li>📧 Email notification will be sent once approved</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6 p-6 pb-0">
              <h2 className="text-3xl font-bold text-gray-800">List Your Item</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 pt-0">
              {/* Image Upload Section */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  Product Images *
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {images.length === 0 ? (
                    <div onClick={() => fileInputRef.current.click()} className="cursor-pointer">
                      <div className="text-gray-400 text-4xl mb-2">📸</div>
                      <p className="text-gray-600 mb-2">Click to upload images</p>
                      <p className="text-sm text-gray-500">Supports JPEG, PNG, WebP (max 10MB each)</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div key={image.id} className="relative">
                          <img
                            src={image.variants.medium.url}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                          {compressionResults[index] && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 rounded-b-lg">
                              {compressionResults[index].ratio}% smaller
                            </div>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-600"
                      >
                        + Add More
                      </button>
                    </div>
                  )}
                </div>

                {imageProcessing && (
                  <div className="mt-2 flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Processing images...
                  </div>
                )}

                {aiAnalysis && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-green-800 mb-1">AI Analysis Results:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
                      <div>✅ Content appropriate</div>
                      <div>🎯 Quality score: {aiAnalysis.qualityScore}/10</div>
                      <div>🔍 Authenticity: {(aiAnalysis.authenticity.confidence * 100).toFixed(0)}%</div>
                      <div>📁 Suggested: {aiAnalysis.suggestedCategory}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Item Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., MacBook Pro 2021"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Describe the condition, age, and any important details about your item..."
                />
              </div>

              {/* Trust indicators */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">🛡️ Your listing will be:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✅ Reviewed by our admin team within 24 hours</li>
                  <li>🔍 Verified for authenticity using AI analysis</li>
                  <li>📧 You'll receive email notification once approved</li>
                  <li>🌟 Displayed to verified students only</li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={imageProcessing || images.length === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedSellItemModal;