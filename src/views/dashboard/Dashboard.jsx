import React, { useState, useEffect } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { url } from "../../utils/Constants";
import Notification from "../../components/notification/index.jsx";
import "chart.js/auto";

const Dashboard = () => {
const [passTimeLeftData, setPassTimeLeftData] = useState([]);
const [todayVisitorData, setTodayVisitorData] = useState({});
const [weeklyVisitorData, setWeeklyVisitorData] = useState({});
const [visitorInZonesData, setVisitorInZonesData] = useState({});

const getPassTimeLeft = async () => {
try {
const response = await fetch(`${url}/dashboard/pass-time-left/`, {
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${localStorage.getItem("token")}`,
},
});
const json = await response.json();
if (response.ok) setPassTimeLeftData(json);
else Notification.showErrorMessage("Try Again!", json.error);
} catch {
Notification.showErrorMessage("Error", "Server error!");
}
};

const getTodayVisitorVisitDashboard = async () => {
try {
const response = await fetch(`${url}/dashboard/today-visitor-visit/`, {
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${localStorage.getItem("token")}`,
},
});
const json = await response.json();
if (response.ok) setTodayVisitorData(json);
else Notification.showErrorMessage("Try Again!", json.error);
} catch {
Notification.showErrorMessage("Error", "Server error!");
}
};

const getWeeklyVisitorVisit = async () => {
try {
const response = await fetch(`${url}/dashboard/weekly-visitor-visit/`, {
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${localStorage.getItem("token")}`,
},
});
const json = await response.json();
if (response.ok) setWeeklyVisitorData(json);
else Notification.showErrorMessage("Try Again!", json.error);
} catch {
Notification.showErrorMessage("Error", "Server error!");
}
};

const getVisitorInZones = async () => {
try {
const response = await fetch(`${url}/dashboard/visitor-in-zone/`, {
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${localStorage.getItem("token")}`,
},
});
const json = await response.json();
if (response.ok) setVisitorInZonesData(json);
else Notification.showErrorMessage("Try Again!", json.error);
} catch {
Notification.showErrorMessage("Error", "Server error!");
}
};

const calculateMinutesBetweenDates = (start, end) => {
const diff = new Date(end) - new Date(start);
return Math.max(0, Math.round(diff / 60000));
};

const formatDate = (date) => {
const d = new Date(date);
return d.toISOString().split("T")[0];
};

const today = formatDate(new Date());
const hours = [
"09:00:00", "09:30:00", "10:00:00", "10:30:00", "11:00:00", "11:30:00",
"12:00:00", "12:30:00", "13:00:00", "13:30:00", "14:00:00", "14:30:00",
"15:00:00", "15:30:00", "16:00:00", "16:30:00", "17:00:00", "17:30:00", "18:00:00"
];

const timeSlots = {
"9am": 0, "10am": 0, "11am": 0, "12pm": 0, "1pm": 0,
"2pm": 0, "3pm": 0, "4pm": 0, "5pm": 0, "6pm": 0
};

for (const time of hours) {
const slotHour = parseInt(time.split(":")[0], 10);
const key = `${slotHour % 12 || 12}${slotHour >= 12 ? "pm" : "am"}`;
const keyFormatted = key.toLowerCase().replace("12pm", "12pm").replace("12am", "12am");
timeSlots[keyFormatted] += todayVisitorData[`${today} ${time}`] || 0;
}

useEffect(() => {
getPassTimeLeft();
getTodayVisitorVisitDashboard();
getWeeklyVisitorVisit();
getVisitorInZones();
}, []);

return (
<div className="p-6">
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
<div className=" bg-white border rounded shadow p-4 h-80 flex flex-col pb-10">
<h2 className="text-lg font-bold mb-3">Weekly Visitors</h2>
<Bar
data={{
labels: Object.keys(weeklyVisitorData),
datasets: [{
label: "Weekly Visitors",
data: Object.values(weeklyVisitorData),
backgroundColor: "rgba(53, 162, 235, 0.83)",
}]
}}
options={{ maintainAspectRatio: false }}
/>
</div>

<div className="bg-white border rounded shadow p-4 h-80 flex flex-col pb-10">
<h2 className="text-lg font-bold mb-3">Today's Visitors</h2>
<Line
data={{
labels: Object.keys(timeSlots),
datasets: [{
label: "Visits",
data: Object.values(timeSlots),
fill: true,
borderColor: "rgb(59, 130, 246)",
backgroundColor: "rgba(59, 131, 246, 0.71)",
tension: 0.4,
}]
}}
options={{ maintainAspectRatio: false }}
/>
</div>

<div className="bg-white border rounded shadow p-4 h-80 flex flex-col pb-16">
<h2 className="text-lg font-bold mb-3">People in Department</h2>
<Doughnut
data={{
labels: Object.keys(visitorInZonesData),
datasets: [{
data: Object.values(visitorInZonesData),
backgroundColor: [
"rgba(255, 99, 133, 0.82)",
"rgba(53, 162, 235, 0.83)",
"rgba(75, 192, 192, 0.84)",
],
}]
}}
options={{ maintainAspectRatio: false }}
/>
</div>
</div>

<div className="grid gap-4 mb-8 my-20">
<div className="bg-white border rounded shadow">
<h2 className="text-lg font-bold p-4 border-b bg-blue-100">
Today's visitors ({passTimeLeftData.length})
</h2>
<div className="p-4 overflow-auto" style={{ maxHeight: "340px" }}>
<table className="min-w-full">
<thead>
<tr className="text-left">
<th className="px-2 pb-2 text-center">Image</th>
<th className="px-6 pb-2">Name</th>
<th className="px-6 pb-2">Remaining Time</th>
<th className="px-6 pb-2">Phone No</th>
<th className="px-6 pb-2">Gov. ID Type</th>
<th className="px-6 pb-2">Gov. ID No</th>
</tr>
</thead>
<tbody>
{passTimeLeftData.map((visitor, index) => {
const total = calculateMinutesBetweenDates(visitor.pass_created_at, visitor.valid_upto);
const left = calculateMinutesBetweenDates(new Date(), visitor.valid_upto);
const percent = total === 0 ? 100 : ((total - left) / total) * 100;

return (
<tr key={index} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
<td className="py-2 text-center">
<div className="inline-block h-12 w-12 border rounded-full overflow-hidden bg-customGreen">
{visitor.image ? (
<img src={`data:image/jpeg;base64,${visitor.image}`} alt="img" />
) : (
<div className="flex items-center justify-center h-full text-white">
{visitor.visitor_name?.charAt(0).toUpperCase() || "N"}
</div>
)}
</div>
</td>
<td className="px-6 py-2">{visitor.visitor_name}</td>
<td className="px-6 py-2">
<div className="w-3/4 bg-gray-200 rounded-full h-2.5 relative group">
<div
className="bg-blue-500 h-2.5 rounded-full"
style={{ width: `${100 - percent}%` }}
/>
<div className="absolute left-0 mt-2 p-1 text-xs text-white bg-customGreen rounded opacity-0 group-hover:opacity-100">
{left} min left
</div>
</div>
</td>
<td className="px-6 py-2">{visitor.phone}</td>
<td className="px-6 py-2">{visitor.gov_id_type?.replace('_', ' ')}</td>
<td className="px-6 py-2">{visitor.gov_id_no}</td>
</tr>
);
})}
</tbody>
</table>
</div>
</div>
</div>
</div>
);
};

export default Dashboard;