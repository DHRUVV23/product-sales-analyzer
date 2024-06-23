import DashboardLayout from "@/components/dashboard";

async function fetchData(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Unexpected response content type: ${contentType}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: [] }; // Return empty array or handle error case appropriately
  }
}

export default async function Home() {
  try {
    const [allProducts, allVisitors] = await Promise.all([
      fetchData(`${process.env.API_URL}/api/product/all-products`),
      fetchData(`${process.env.API_URL}/api/visitors/all-visitors`),
    ]);

    console.log("Fetched products:", allProducts);
    console.log("Fetched visitors:", allVisitors);

    return (
      <DashboardLayout
        allProducts={allProducts.data}
        allVisitors={allVisitors.data}
      />
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <DashboardLayout
        allProducts={[]}
        allVisitors={[]}
      />
    );
  }
}
