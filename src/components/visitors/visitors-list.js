import { deviceMapper, monthsMapper, visitorsTableHeaders } from "@/utils/config";
import Table from "../Table";

async function extractAllVisitors() {
  const res = await fetch(`${process.env.API_URL}/visitors/all-visitors`, {
    method: "GET",
    cache: "no-store",
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch visitors: ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export default async function VisitorsList() {
  let allVisitors = [];
  
  try {
    const data = await extractAllVisitors();
    allVisitors = data.data;
  } catch (error) {
    console.error('Error fetching visitors:', error);
  }
  
  return (
    <Table
      tableHeaderText="All Visitors Overview"
      tableHeaderCells={visitorsTableHeaders}
      data={
        allVisitors && allVisitors.length
          ? allVisitors.map(item => ({
            ...item,
            month: monthsMapper[item.month],
            device: deviceMapper[item.device]
          }))
          : []
      }
    />
  );
}
