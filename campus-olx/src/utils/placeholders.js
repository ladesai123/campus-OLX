// Utility function to generate placeholder images using canvas and data URIs
export const generatePlaceholder = (width = 600, height = 400, text = 'Image', bgColor = '#e5e7eb', textColor = '#374151') => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Add text
  ctx.fillStyle = textColor;
  ctx.font = `${Math.min(width, height) / 10}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  return canvas.toDataURL();
};

// Pre-generated placeholder for avatar images
export const generateAvatarPlaceholder = (initial = 'U', size = 40) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  
  const ctx = canvas.getContext('2d');
  
  // Fill background with nice color
  ctx.fillStyle = '#6b7280';
  ctx.fillRect(0, 0, size, size);
  
  // Add initial
  ctx.fillStyle = '#ffffff';
  ctx.font = `${size * 0.4}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initial.toUpperCase(), size / 2, size / 2);
  
  return canvas.toDataURL();
};

// Static placeholder image data URI for better performance
export const DEFAULT_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjI0MCIgeT0iMTYwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiByeD0iNCIgZmlsbD0iIzlDQTNBRiIvPgo8Y2lyY2xlIGN4PSIyNzAiIGN5PSIxODAiIHI9IjEwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Im0yODAgMjAwIDIwIDIwaDQwbC0yMC0yMHoiIGZpbGw9IiNGM0Y0RjYiLz4KPHRleHQgeD0iMzAwIiB5PSIyNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';