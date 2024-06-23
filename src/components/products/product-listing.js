import { monthsMapper, productTableHeaders } from "@/utils/config";
import Table from "../Table";

async function extractAllProducts() {
  const res = await fetch(`${process.env.API_URL}/product/all-products`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export default async function ProductListing() {
  let allProducts = [];

  try {
    const data = await extractAllProducts();
    allProducts = data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <Table
      tableHeaderText="All Products Overview"
      tableHeaderCells={productTableHeaders}
      data={
        allProducts && allProducts.length
          ? allProducts.map((item) => ({
              ...item,
              revenue: parseInt(item.price * item.sales),
              month: monthsMapper[item.month],
            }))
          : []
      }
    />
  );
}
