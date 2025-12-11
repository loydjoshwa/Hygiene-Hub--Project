import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Search, Plus, Star, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    rating: '4.5',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3130/products');
      setProducts(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load products');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: Number(formData.price),
      rating: Number(formData.rating)
    };

    try {
      if (editingProduct) {
        await axios.put(`http://localhost:3130/products/${editingProduct.id}`, productData);
        toast.success('Product updated successfully!');
      } else {
        const newProduct = {
          ...productData,
          id: `p${Date.now()}`
        };
        await axios.post('http://localhost:3130/products', newProduct);
        toast.success('Product added successfully!');
      }
      
      fetchProducts();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      rating: product.rating.toString(),
      image: product.image
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`http://localhost:3130/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      rating: '4.5',
      image: ''
    });
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-[3px] border-[#00CAFF] border-t-[#4300FF]"></div>
            <p className="mt-6 text-gray-600 font-medium">Loading products...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <AdminLayout>
        <div className="p-6">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4300FF] to-[#00CAFF] bg-clip-text text-transparent">
                  Manage Products
                </h1>
                <p className="text-gray-600 mt-2">Total Products: <span className="font-semibold text-[#0065F8]">{products.length}</span></p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#4300FF] to-[#0065F8] text-white rounded-xl hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00CAFF]/30 focus:border-[#0065F8] outline-none transition-all"
              />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00CAFF]/10 to-[#00FFDE]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#0065F8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">No products found</h3>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#4300FF] to-[#0065F8] text-white rounded-xl hover:shadow-xl transition-all inline-flex items-center gap-2 mt-4"
              >
                <Plus className="w-5 h-5" />
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gradient-to-r from-gray-50/50 to-transparent transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-20 h-20 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150';
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2 max-w-md">{product.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-2xl font-bold bg-gradient-to-r from-[#4300FF] to-[#0065F8] bg-clip-text text-transparent">
                            ₹{product.price}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex">
                              {renderStars(product.rating)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                              <span className="text-xs text-gray-500">/5</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="px-4 py-2 bg-gradient-to-r from-[#00CAFF] to-[#00FFDE] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-slideUp">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#4300FF] to-[#00CAFF] bg-clip-text text-transparent">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <p className="text-gray-600 mt-1">Fill in the product details below</p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00CAFF]/30 focus:border-[#0065F8] outline-none transition-all"
                        required
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00CAFF]/30 focus:border-[#0065F8] outline-none transition-all"
                        required
                        placeholder="Enter price"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Rating</label>
                      <div className="relative">
                        <Star className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5" />
                        <select
                          name="rating"
                          value={formData.rating}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00CAFF]/30 focus:border-[#0065F8] outline-none transition-all appearance-none"
                        >
                          {[4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0].map(num => (
                            <option key={num} value={num}>{num} Stars</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Image URL *</label>
                      <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00CAFF]/30 focus:border-[#0065F8] outline-none transition-all"
                          required
                          placeholder="Enter image URL"
                        />
                      </div>
                      {formData.image && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                          <img 
                            src={formData.image} 
                            alt="Preview" 
                            className="h-32 w-full object-cover rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/300x150?text=Invalid+Image+URL';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00CAFF]/30 focus:border-[#0065F8] outline-none transition-all"
                    required
                    placeholder="Enter product description"
                  />
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#4300FF] to-[#0065F8] text-white py-3.5 rounded-xl hover:shadow-xl transition-all font-medium"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageProducts;