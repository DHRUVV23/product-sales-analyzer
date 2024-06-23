import { deviceMapper, monthsMapper, visitorsTableHeaders } from "@/utils/config";
import Table from "../Table";

async function fetchVisitors() {
  try {
    const res = await fetch(`${process.env.API_URL}/api/visitors/all-visitors`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch visitors: ${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text(); // Read response as text for debugging
      console.error(`Unexpected response content type: ${contentType}`);
      console.error(`Response text: ${text}`);
      throw new Error(`Unexpected response content type: ${contentType}`);
    }

    return await res.json(); // Return JSON data
  } catch (error) {
    console.error("Error fetching visitors:", error);
    return { data: [] }; // Return empty array or handle error case appropriately
  }
}

export default function VisitorsList() {
  const { data: allVisitors } = useQuery("allVisitors", fetchVisitors); // Using React Query for data fetching

  console.log("Fetched visitors:", allVisitors);

  return (
    <Table
      tableHeaderText="All Visitors Overview"
      tableHeaderCells={visitorsTableHeaders}
      data={
        allVisitors && allVisitors.length
          ? allVisitors.map((item) => ({
              ...item,
              month: monthsMapper[item.month],
              device: deviceMapper[item.device],
            }))
          : []
      }
    />
  );
}
