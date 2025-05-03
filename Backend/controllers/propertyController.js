import Property from '../models/Property.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


const createProperty = async (req, res) => {
  try {
    const property = new Property(req.body);
    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProperties = async (req, res) => {
  try {
    const { 
      keyword = '', 
      location = '', 
      minPrice, 
      maxPrice, 
      propertyType, 
      bedrooms,
      page = 1,
      limit = 10
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Search by keyword in title or description
    if (keyword) {
      filter.$text = { $search: keyword };
    }
    
    // Filter by location
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }
    
    // Filter by property type
    if (propertyType) {
      filter.propertyType = propertyType;
    }
    
    // Filter by bedrooms
    if (bedrooms) {
      filter.bedrooms = Number(bedrooms);
    }
    
    // Calculate pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Get properties
    const properties = await Property.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });
    
    // Get total count
    const total = await Property.countDocuments(filter);
    
    res.json({
      properties,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (property) {
      Object.keys(req.body).forEach(key => {
        property[key] = req.body[key];
      });
      
      const updatedProperty = await property.save();
      res.json(updatedProperty);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (property) {
      // Delete images from Cloudinary
      for (const imageUrl of property.images) {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      
      await Property.deleteOne({ _id: property._id });
      res.json({ message: 'Property removed' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadPropertyImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    console.log('File received:', req.file);
    
    // Check if we're in production mode (using memoryStorage)
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary configuration missing');
      return res.status(500).json({ message: 'Server configuration error: Cloudinary not properly configured' });
    }
    
    // Cloudinary upload error handling
    console.log('Attempting to upload to Cloudinary...');
    try {
      let result;
      
      if (isProduction) {
        // Upload directly from buffer in production
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        
        result = await cloudinary.uploader.upload(dataURI, {
          folder: 'property_images',
          resource_type: 'auto'
        });
      } else {
        // In development, upload from disk file path
        if (!fs.existsSync(req.file.path)) {
          return res.status(400).json({ message: 'File does not exist at the specified path' });
        }
        
        const stats = fs.statSync(req.file.path);
        console.log('File size:', stats.size, 'bytes');
        
        result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'property_images',
          resource_type: 'auto'
        });
        
        // Clean up local file in development
        try {
          console.log('Removing temporary file:', req.file.path);
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error removing temporary file:', unlinkError);
        }
      }
      
      console.log('Cloudinary upload success:', result.secure_url);
      
      if (!result || !result.secure_url) {
        return res.status(500).json({ message: 'Failed to retrieve URL from Cloudinary' });
      }
      
      return res.json({
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      return res.status(500).json({ message: `Cloudinary upload failed: ${cloudinaryError.message}` });
    }
  } catch (error) {
    console.error('Image upload error:', error);

    // Clean up temp file if it exists in development
    if (!isProduction && req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        console.log('Cleaning up file after error:', req.file.path);
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }
    
    res.status(500).json({ message: error.message || 'Failed to upload image' });
  }
};

export {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  uploadPropertyImage,
};
