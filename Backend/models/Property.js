import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  propertyType: {
    type: String,
    required: [true, "Property type is required"],
    enum: ["House", "Apartment", "Villa", "Plot", "Commercial", "Other"],
  },
  bedrooms: {
    type: Number,
    default: 0,
  },
  bathrooms: {
    type: Number,
    default: 0,
  },
  area: {
    type: Number,
    required: [true, "Area is required"],
  },
  areaUnit: {
    type: String,
    default: "sq.ft",
    enum: ["sq.ft", "sq.m", "acres", "hectares"],
  },
  amenities: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    required: [true, "At least one image is required"],
  },
  contactInfo: {
    name: String,
    phone: String,
    email: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true
});

// add text index for search functionality
propertySchema.index({ 
  title: 'text', 
  description: 'text', 
  location: 'text', 
  propertyType: 'text' 
});

const Property = mongoose.model("Property", propertySchema);
export default Property;
