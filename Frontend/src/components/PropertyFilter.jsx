import React, { useState } from 'react';

const PropertyFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      bedrooms: '',
    });
    onFilter({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Keyword */}
          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
              Keyword
            </label>
            <input
              type="text"
              id="keyword"
              name="keyword"
              value={filters.keyword}
              onChange={handleChange}
              placeholder="Search by title, description..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="City, area, locality..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                placeholder="₹"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                placeholder="₹"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={filters.propertyType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
              Bedrooms
            </label>
            <select
              id="bedrooms"
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5+</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleReset}
            className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyFilter;
