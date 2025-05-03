import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    address: '',
    propertyType: 'House',
    bedrooms: '',
    bathrooms: '',
    area: '',
    areaUnit: 'sq.ft',
    amenities: [],
    images: [],
    contactInfo: {
      name: '',
      phone: '',
      email: '',
    },
    isAvailable: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  
  // Redirect if not authenticated or not admin
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (isAuthenticated && !isAdmin) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/properties');
      setProperties(data.properties);
    } catch (error) {
      toast.error('Failed to fetch properties');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contactInfo.')) {
      const contactField = name.split('.')[1];
      setFormData({
        ...formData,
        contactInfo: {
          ...formData.contactInfo,
          [contactField]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()],
      });
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type and size
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      setUploadingImage(true);
      toast.info('Uploading image...');
      
      const { data } = await api.post('/properties/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (!data || !data.imageUrl) {
        throw new Error('Invalid response from server');
      }
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, data.imageUrl],
      }));
      
      toast.success('Image uploaded successfully');
      e.target.value = ''; // Reset input field
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      location: '',
      address: '',
      propertyType: 'House',
      bedrooms: '',
      bathrooms: '',
      area: '',
      areaUnit: 'sq.ft',
      amenities: [],
      images: [],
      contactInfo: {
        name: '',
        phone: '',
        email: '',
      },
      isAvailable: true,
    });
    setEditingProperty(null);
  };

  const handleNewProperty = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditProperty = (property) => {
    setFormData({
      ...property,
      price: property.price.toString(),
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      area: property.area.toString(),
    });
    setEditingProperty(property._id);
    setShowForm(true);
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await api.delete(`/properties/${id}`);
        toast.success('Property deleted successfully');
        fetchProperties();
      } catch (error) {
        toast.error('Failed to delete property');
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.price || !formData.location || !formData.images.length) {
      toast.error('Please fill all required fields and upload at least one image');
      return;
    }

    try {
      // Parse numeric values
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
      };

      if (editingProperty) {
        await api.put(`/properties/${editingProperty}`, propertyData);
        toast.success('Property updated successfully');
      } else {
        await api.post('/properties', propertyData);
        toast.success('Property created successfully');
      }

      setShowForm(false);
      resetForm();
      fetchProperties();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save property');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleNewProperty}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Property
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {editingProperty ? 'Edit Property' : 'Add New Property'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Property Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type *
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Plot">Plot</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        id="bedrooms"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        id="bathrooms"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                        Area *
                      </label>
                      <input
                        type="number"
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label htmlFor="areaUnit" className="block text-sm font-medium text-gray-700 mb-1">
                        Area Unit
                      </label>
                      <select
                        id="areaUnit"
                        name="areaUnit"
                        value={formData.areaUnit}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="sq.ft">sq.ft</option>
                        <option value="sq.m">sq.m</option>
                        <option value="acres">acres</option>
                        <option value="hectares">hectares</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="6"
                required
              ></textarea>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Amenities</h3>
              
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded-l-md"
                  placeholder="Add an amenity (e.g., Swimming Pool)"
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <span className="text-gray-800">{amenity}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(index)}
                      className="ml-2 text-gray-500 hover:text-red-600"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactInfo.name"
                    value={formData.contactInfo.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="contactPhone"
                    name="contactInfo.phone"
                    value={formData.contactInfo.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactInfo.email"
                    value={formData.contactInfo.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Images *</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Property Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={uploadingImage}
                />
                {uploadingImage && <p className="mt-2 text-sm text-gray-600">Uploading image...</p>}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt={`Property ${index}`} className="w-full h-32 object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-700"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              {formData.images.length === 0 && (
                <p className="text-red-500 text-sm mt-2">At least one image is required</p>
              )}
            </div>

            {/* Form buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingProperty ? 'Update Property' : 'Create Property'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : properties.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Added
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={property.images[0]} 
                              alt={property.title} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{property.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">₹{property.price.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {property.propertyType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditProperty(property)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium text-gray-700 mb-2">No properties found</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first property</p>
              <button
                onClick={handleNewProperty}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Property
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
