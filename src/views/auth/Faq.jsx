import React, { useState } from "react";
import Header from "../../components/header";

const Faq = () => {
const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(null);

const toggleQuestion = (index) => {
setExpandedQuestionIndex(expandedQuestionIndex === index ? null : index);
};

return (
<div className="p-6 sm:p-10 max-w-5xl mx-auto">
<Header title="Frequently Asked Question" subtitle="Frequently Asked Questions" />

<div className="space-y-6 mt-6">
{questions.map((question, index) => (
<div
key={index}
className="rounded-xl border border-blue-700 shadow-sm overflow-hidden transition duration-300 bg-white"
>
<button
onClick={() => toggleQuestion(index)}
className="flex justify-between items-center w-full p-5 text-left bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 focus:outline-none"
>
<span className="text-lg font-medium text-blue-900">{question.title}</span>
<svg
className={`w-8 h-8 text-blue-600 transform transition-transform duration-300 ${
expandedQuestionIndex === index ? "rotate-180" : ""
}`}
fill="none"
stroke="currentColor"
strokeWidth={2}
viewBox="0 0 24 24"
xmlns="http://www.w3.org/2000/svg"
>
<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
</svg>
</button>

{expandedQuestionIndex === index && (
<div className="px-5 py-4 text-gray-700 bg-white border-t border-gray-100">
<p className="leading-relaxed text-base">{question.answer}</p>
</div>
)}
</div>
))}
</div>
</div>
);
};

const questions = [

{
title: "How to Add a new Visitor",
answer:
"Click on the 'visitor' option on the sidebar, then click on the 'add visitor' button and fill in the details and finally submit after signature.",
},
{
title: "How to Generate a Pass",
answer:
"You can generate a pass directly from the visitor table by clicking on the 'Generate Pass' option, filling in the required details, and then clicking 'Submit'. The pass will be generated successfully" },
{
title: "How to Add an Employee",
answer:
"By clicking on the 'add employee' button from the sidebar and filling in the details in the form.",
},
{
title: "How Can We See Visitors/Passes/Appointments/Employees",
answer:
"We can easily see all details listing from the sidebar.",
},
];

export default Faq;