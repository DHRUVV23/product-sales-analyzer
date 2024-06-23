import DashboardLayout from "@/components/dashboard";

async function extractAllProducts() {
  try {
    const res = await fetch(`${process.env.API_URL}/api/product/all-products`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [] }; // Return empty array or handle error case appropriately
  }
}

async function extractAllVisitors() {
  try {
    const res = await fetch(`${process.env.API_URL}/api/visitors/all-visitors`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch visitors: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching visitors:", error);
    return { data: [] }; // Return empty array or handle error case appropriately
  }
}


export default async function Home() {
  const allProducts = await extractAllProducts();
  const allVisitors = await extractAllVisitors();

  return (
    <DashboardLayout allProducts={allProducts && allProducts.data} allVisitors={allVisitors && allVisitors.data} />
  );
}
