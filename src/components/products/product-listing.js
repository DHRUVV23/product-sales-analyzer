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
      throw new Error("Unexpected response content type");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [] }; // Return empty array or handle error case appropriately
  }
}

export default async function ProductListing() {
  const allProducts = await extractAllProducts();

  console.log(allProducts);

  return (
    <Table
      tableHeaderText="All Products Overview"
      tableHeaderCells={productTableHeaders}
      data={
        allProducts && allProducts.data && allProducts.data.length
          ? allProducts.data.map((item) => ({
              ...item,
              revenue: parseInt(item.price * item.sales),
              month: monthsMapper[item.month],
            }))
          : []
      }
    />
  );
}
