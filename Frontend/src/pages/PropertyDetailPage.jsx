import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/properties/${id}`);
      setProperty(data);
      setCurrentImage(0);
    } catch (error) {
      toast.error('Failed to fetch property details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h2>
        <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Link to="/properties" className="text-blue-600 hover:underline">
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/properties" className="text-blue-600 hover:underline flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Properties
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Images */}
        <div className="lg:col-span-2">
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={property.images[currentImage]}
              alt={property.title}
              className="w-full h-96 object-cover"
            />
          </div>
          
          {/* Thumbnail images */}
          {property.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                    index === currentImage ? 'ring-2 ring-blue-600' : ''
                  }`}
                >
                  <img src={image} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Property Details */}
          <div className="mt-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
            <p className="text-gray-600 text-lg mb-4">{property.location}</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span>{property.propertyType}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                </svg>
                <span>{property.area} {property.areaUnit}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>{property.bathrooms} Bathrooms</span>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Description</h2>
            <p className="text-gray-700 mb-6 whitespace-pre-line">{property.description}</p>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Address</h2>
              <p className="text-gray-700">{property.address}</p>
            </div>
          </div>
        </div>

        {/* Property Price & Contact Info */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">₹{property.price.toLocaleString()}</h2>
            
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
              {property.contactInfo && (
                <div className="space-y-3">
                  {property.contactInfo.name && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <span className="text-gray-700">{property.contactInfo.name}</span>
                    </div>
                  )}
                  {property.contactInfo.phone && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      <span className="text-gray-700">{property.contactInfo.phone}</span>
                    </div>
                  )}
                  {property.contactInfo.email && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      <span className="text-gray-700">{property.contactInfo.email}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors">
                Contact Owner
              </button>
              <button className="w-full bg-white text-blue-600 border border-blue-600 py-3 rounded-md hover:bg-blue-50 transition-colors">
                Save to Favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
