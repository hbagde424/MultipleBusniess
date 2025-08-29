import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  business: string;
}

export const ProductCRUD: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    business: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // CREATE - Add new product
  const createProduct = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
        resetForm();
        alert('Product created successfully!');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    }
    setIsLoading(false);
  };

  // READ - Get all products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setIsLoading(false);
  };

  // UPDATE - Edit existing product
  const updateProduct = async () => {
    if (!editingProduct) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => 
          p._id === editingProduct._id ? updatedProduct : p
        ));
        resetForm();
        alert('Product updated successfully!');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
    setIsLoading(false);
  };

  // DELETE - Remove product
  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setProducts(products.filter(p => p._id !== productId));
        alert('Product deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
    setIsLoading(false);
  };

  // Helper functions
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      business: ''
    });
    setEditingProduct(null);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      business: product.business
    });
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Product Management (CRUD Demo)</h1>
      
      {/* CREATE/UPDATE FORM */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          
          <Input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
          />
          
          <Input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          />
          
          <Input
            type="text"
            placeholder="Business ID"
            value={formData.business}
            onChange={(e) => setFormData({...formData, business: e.target.value})}
          />
        </div>
        
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
          placeholder="Product Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={3}
        />
        
        <div className="flex gap-2">
          <Button 
            onClick={editingProduct ? updateProduct : createProduct}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isLoading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
          </Button>
          
          {editingProduct && (
            <Button 
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* READ - PRODUCTS LIST */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Products List</h2>
            <Button 
              onClick={fetchProducts}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{product.name}</td>
                  <td className="px-6 py-4">{product.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startEdit(product)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-xs px-3 py-1"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteProduct(product._id)}
                        className="bg-red-500 hover:bg-red-600 text-xs px-3 py-1"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {products.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              No products found. Create your first product!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCRUD;
