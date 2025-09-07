import imageCompression from 'browser-image-compression';

// Deep learning-inspired compression options
const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.1, // Extremely compressed - 100KB max
  maxWidthOrHeight: 800, // Max dimension
  useWebWorker: true,
  maxIteration: 20, // More iterations for better compression
  alwaysKeepResolution: false,
  preserveExif: false,
  initialQuality: 0.6, // Start with lower quality
};

// Advanced compression with multiple passes
export const compressImage = async (file) => {
  try {
    console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    
    // First pass - aggressive compression
    let compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);
    console.log('After first compression:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
    
    // If still too large, apply second pass with even more aggressive settings
    if (compressedFile.size > 100000) { // 100KB
      const secondPassOptions = {
        ...COMPRESSION_OPTIONS,
        maxSizeMB: 0.05, // 50KB max
        maxWidthOrHeight: 600,
        initialQuality: 0.4,
      };
      
      compressedFile = await imageCompression(compressedFile, secondPassOptions);
      console.log('After second compression:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
    }
    
    // Generate optimized preview URL
    const previewUrl = URL.createObjectURL(compressedFile);
    
    return {
      compressedFile,
      previewUrl,
      originalSize: file.size,
      compressedSize: compressedFile.size,
      compressionRatio: ((file.size - compressedFile.size) / file.size * 100).toFixed(1)
    };
  } catch (error) {
    console.error('Image compression failed:', error);
    throw new Error('Failed to compress image. Please try a different image.');
  }
};

// Validate image file
export const validateImage = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeInBytes = 10 * 1024 * 1024; // 10MB original max
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Please upload a valid image file (JPEG, PNG, or WebP)');
  }
  
  if (file.size > maxSizeInBytes) {
    throw new Error('Image file is too large. Please choose a file under 10MB.');
  }
  
  return true;
};

// AI-powered image analysis (simulated for demo)
export const analyzeImageContent = async (file) => {
  // In production, this would integrate with Google Vision API, AWS Rekognition, etc.
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate AI analysis results
      const analysisResults = {
        isAppropriate: true,
        confidence: 0.95,
        detectedObjects: ['book', 'desk', 'lamp'], // Example objects
        suggestedCategory: 'Electronics',
        qualityScore: 8.5,
        authenticity: {
          isAuthentic: true,
          confidence: 0.92,
          flags: []
        }
      };
      
      resolve(analysisResults);
    }, 1500); // Simulate processing time
  });
};

// Create optimized image variants
export const createImageVariants = async (compressedFile) => {
  try {
    // Thumbnail (150x150)
    const thumbnailOptions = {
      maxSizeMB: 0.02, // 20KB max
      maxWidthOrHeight: 150,
      useWebWorker: true,
      initialQuality: 0.7,
    };
    
    // Medium size (400x400)
    const mediumOptions = {
      maxSizeMB: 0.05, // 50KB max
      maxWidthOrHeight: 400,
      useWebWorker: true,
      initialQuality: 0.8,
    };
    
    const [thumbnail, medium] = await Promise.all([
      imageCompression(compressedFile, thumbnailOptions),
      imageCompression(compressedFile, mediumOptions)
    ]);
    
    return {
      thumbnail: {
        file: thumbnail,
        url: URL.createObjectURL(thumbnail),
        size: thumbnail.size
      },
      medium: {
        file: medium,
        url: URL.createObjectURL(medium),
        size: medium.size
      },
      full: {
        file: compressedFile,
        url: URL.createObjectURL(compressedFile),
        size: compressedFile.size
      }
    };
  } catch (error) {
    console.error('Failed to create image variants:', error);
    throw error;
  }
};

// Upload to Supabase Storage
export const uploadImageToSupabase = async (supabase, file, userId, itemId) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${itemId}_${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('item-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('item-images')
      .getPublicUrl(fileName);
    
    return {
      path: data.path,
      publicUrl,
      fileName
    };
  } catch (error) {
    console.error('Upload failed:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};