import DashboardLayout from "@/components/dashboard";

async function extractAllProducts() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/product/all-products`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Unexpected response content type: ${contentType}`);
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
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/visitors/all-visitors`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch visitors: ${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Unexpected response content type: ${contentType}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching visitors:", error);
    return { data: [] }; // Return empty array or handle error case appropriately
  }
}

export default async function Home() {
  const [allProducts, allVisitors] = await Promise.all([
    extractAllProducts(),
    extractAllVisitors(),
  ]);

  return (
    <DashboardLayout
      allProducts={allProducts.data}
      allVisitors={allVisitors.data}
    />
  );
}
