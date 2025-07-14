import React from 'react';
import { Package } from 'lucide-react';

const Inventory = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600">Monitor stock levels and manage inventory across all products</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Inventory Management Module</h2>
        <p className="text-gray-600 mb-4">
          This page will contain comprehensive inventory tracking and management tools.
        </p>
        <p className="text-sm text-gray-500">
          Features: Real-time stock levels, low stock alerts, reorder suggestions, category breakdown
        </p>
      </div>
    </div>
  );
};

export default Inventory;
