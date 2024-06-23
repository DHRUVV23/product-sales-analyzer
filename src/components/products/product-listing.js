import { monthsMapper, productTableHeaders } from "@/utils/config";
import Table from "../Table";

async function extractAllProducts() {
  try {
    const res = await fetch(`${process.env.API_URL}/api/product/all-products`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text(); // Read as text
      throw new Error(`Unexpected response content type: ${contentType}. Response: ${text}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [] }; // Return empty array or handle error case appropriately
  }
}

export default function ProductListing() {
  const fetchData = async () => {
    try {
      const allProducts = await extractAllProducts();
      console.log("Fetched products:", allProducts);
      return allProducts.data || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  return (
    <Table
      tableHeaderText="All Products Overview"
      tableHeaderCells={productTableHeaders}
      data={fetchData().then(products =>
        products.map(item => ({
          ...item,
          revenue: parseInt(item.price * item.sales),
          month: monthsMapper[item.month] ?? "Unknown",
        }))
      )}
    />
  );
}
