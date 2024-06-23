import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { monthsMapper, productTableHeaders } from '@/utils/config';
import Table from '../Table';

const API_TIMEOUT = 10000; // Timeout in milliseconds

async function fetchProducts() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const res = await fetch(`${process.env.API_URL}/api/product/all-products`, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text(); // Read as text
      throw new Error(`Unexpected response content type: ${contentType}. Response: ${text}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching products:', error.message);
    return { data: [] };
  } finally {
    clearTimeout(timeoutId);
  }
}

export default function ProductListing() {
  const { data: products, isError, isLoading } = useQuery('allProducts', fetchProducts, {
    retry: 3, // Retry up to 3 times on failure
    refetchOnMount: false, // Disable refetching on component mount
    refetchInterval: false, // Disable automatic refetching
    refetchOnReconnect: false, // Disable refetching on network reconnect
  });

  useEffect(() => {
    if (isError) {
      console.error('Failed to fetch products');
    }
  }, [isError]);

  return (
    <Table
      tableHeaderText="All Products Overview"
      tableHeaderCells={productTableHeaders}
      data={products?.data?.map(item => ({
        ...item,
        revenue: parseInt(item.price * item.sales),
        month: monthsMapper[item.month] ?? 'Unknown',
      })) || []}
      isLoading={isLoading}
    />
  );
}
