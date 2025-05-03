import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyFilter from '../components/PropertyFilter';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const { data } = await api.get(`/properties?${queryParams.toString()}&limit=6`);
      setProperties(data.properties);
      
      if (!Object.keys(filters).length) {
        setFeaturedProperties(data.properties.slice(0, 3));
      }
    } catch (error) {
      toast.error('Failed to fetch properties');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filterData) => {
    setFilters(filterData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white rounded-lg p-8 mb-10">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Dream Property</h1>
          <p className="text-xl mb-6">
            Discover the perfect home with our extensive listings of properties for sale and rent
          </p>
          <Link
            to="/properties"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100"
          >
            Browse All Properties
          </Link>
        </div>
      </div>

      {/* Filter Section */}
      <PropertyFilter onFilter={handleFilter} />

      {/* Property Listings */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {Object.keys(filters).length ? 'Search Results' : 'Latest Properties'}
          </h2>
          <Link to="/properties" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No properties found</h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        )}
      </div>

      {/* Featured Properties Section */}
      {!Object.keys(filters).length && featuredProperties.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
