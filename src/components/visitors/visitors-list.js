import { deviceMapper, monthsMapper, visitorsTableHeaders } from "@/utils/config";
import Table from "../Table";

async function extractAllVisitors() {
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
      const text = await res.text(); // Read response as text
      console.error(`Unexpected response content type: ${contentType}`);
      console.error(`Response text: ${text}`);
      throw new Error(`Unexpected response content type: ${contentType}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching visitors:", error);
    return { data: [] }; // Return empty array or handle error case appropriately
  }
}

export default async function VisitorsList() {
  const allVisitors = await extractAllVisitors();

  console.log("Fetched visitors:", allVisitors);

  return (
    <Table
      tableHeaderText="All Visitors Overview"
      tableHeaderCells={visitorsTableHeaders}
      data={
        allVisitors && allVisitors.data && allVisitors.data.length
          ? allVisitors.data.map(item => ({
              ...item,
              month: monthsMapper[item.month],
              device: deviceMapper[item.device],
            }))
          : []
      }
    />
  );
}
