import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyFilter from '../components/PropertyFilter';
import api from '../api/axios';
import { toast } from 'react-toastify';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  useEffect(() => {
    fetchProperties(1);
  }, [filters]);

  const fetchProperties = async (page) => {
    try {
      setLoading(true);
      
      // Convert filters object to query string
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      // Add pagination
      queryParams.append('page', page);
      queryParams.append('limit', 9); // 9 properties per page
      
      const { data } = await api.get(`/properties?${queryParams.toString()}`);
      
      setProperties(data.properties);
      setPagination({
        page: data.page,
        pages: data.pages,
        total: data.total,
      });
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

  const handlePageChange = (newPage) => {
    fetchProperties(newPage);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Browse Properties</h1>
      
      {/* Filter Section */}
      <PropertyFilter onFilter={handleFilter} />
      
      {/* Results Count */}
      {!loading && (
        <div className="mb-4 text-gray-600">
          Showing {properties.length} of {pagination.total} properties
        </div>
      )}
      
      {/* Property Listings */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No properties found</h3>
          <p className="text-gray-500">Try adjusting your search filters</p>
        </div>
      )}
      
      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={page === pagination.page}
                className={`px-4 py-2 text-sm font-medium border border-gray-300 ${
                  page === pagination.page
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;
