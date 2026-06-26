"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";

export default function Dashboard() {
  const router = useRouter();

  const [result, setResult] = useState<any>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("analysis");

    if (data) {  
      const parsed = JSON.parse(data);  
      setResult(parsed.result);  
      setQuery(parsed.query);  
    }
  }, []);

  const downloadReport = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(18);  
    pdf.text("AI Review Report", 20, 20);  

    pdf.setFontSize(12);  
    pdf.text(`Product: ${query}`, 20, 35);  
    pdf.text(`Sentiment: ${result.analysis.sentiment}`, 20, 45);  
    pdf.text(  
      `Recommendation: ${result.analysis.recommendation.status}`,  
      20,  
      55  
    );  

    pdf.text("Summary:", 20, 70);  
    pdf.text(result.analysis.summary, 20, 80, {  
      maxWidth: 170,  
    });  

    pdf.save(`${query}-report.pdf`);
  };

  const shareReport = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "AI Review Report",
        
        text: `Check this AI Review for ${query}`, 
        url: window.location.href,
      });
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl bg-[#1a365d] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-[#1a365d] w-full min-h-screen flex text-white">
      {/* Sidebar */}  
      <div className="hidden lg:block w-64 bg-[#0a192f] border-r border-gray-800 p-5 sticky top-0 h-screen">  
        <h1  
          onClick={() => router.push("/")}  
          className="text-lg font-bold cursor-pointer mb-8 text-blue-400 flex items-center gap-2"  
        >  
          🏠 AI Review Platform  
        </h1>  

        <div className="space-y-3 text-sm font-medium">  
          <button className="w-full bg-[#1e293b] text-blue-400 py-2.5 rounded-xl border border-blue-900/50 shadow-lg font-semibold">  
            Dashboard  
          </button>  

          <a href="#sentiment" className="block p-2 rounded-lg text-gray-400 hover:bg-slate-800/50 hover:text-white transition-all">  
            Sentiment Overview  
          </a>  

          <a href="#summary" className="block p-2 rounded-lg text-gray-400 hover:bg-slate-800/50 hover:text-white transition-all">  
            Summary  
          </a>  

          <a href="#keywords" className="block p-2 rounded-lg text-gray-400 hover:bg-slate-800/50 hover:text-white transition-all">  
            Keywords  
          </a>  

          <a href="#proscons" className="block p-2 rounded-lg text-gray-400 hover:bg-slate-800/50 hover:text-white transition-all">  
            Pros & Cons  
          </a>  
        </div>  
      </div>  

      <div className="flex-1 p-8 overflow-y-auto">  
        <div className="flex justify-between items-center mb-8">  
          <div>  
            <h1 className="text-3xl font-extrabold tracking-tight text-white">  
              {query} Review  
            </h1>  

            <p className="text-gray-400 mt-1 text-sm font-medium">  
              Analyzed just now • {result.youtube_count} Reviews Processed  
            </p>  
          </div>  

          <div className="flex gap-3">  
            <button  
              onClick={downloadReport}  
              className="bg-[#112240] border border-gray-700 text-gray-300 font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1d3557] transition-all text-sm"  
            >  
              Download Report  
            </button>  

            <button  
              onClick={shareReport}  
              className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all text-sm"  
            >  
              Share  
            </button>  
          </div>  
        </div>  

        <div className="grid lg:grid-cols-3 gap-6">  
          {/* Overall Sentiment */}  
          <div  
            id="sentiment"  
            className="bg-[#112240] rounded-2xl border border-gray-800 p-6 shadow-xl"  
          >  
            <h2 className="font-bold text-gray-400 text-sm uppercase tracking-wider mb-4">  
              Overall Sentiment  
            </h2>  

            <h1 className="text-3xl font-extrabold text-white text-center mb-6">  
              {result.analysis.sentiment}  
            </h1>  

            <div className="mb-4">  
              <div className="flex justify-between text-green-400 font-semibold text-sm">  
                <span>🟢 Positive</span>  
                <span>{result.analysis.positive}%</span>  
              </div>  

              <div className="bg-gray-800 rounded-full h-2.5 mt-2">  
                <div  
                  className="bg-green-500 h-2.5 rounded-full"  
                  style={{ width: `${result.analysis.positive}%` }}  
                />  
              </div>  
            </div>  

            <div>  
              <div className="flex justify-between text-red-400 font-semibold text-sm">  
                <span>🔴 Negative</span>  
                <span>{result.analysis.negative}%</span>  
              </div>  

              <div className="bg-gray-800 rounded-full h-2.5 mt-2">  
                <div  
                  className="bg-red-500 h-2.5 rounded-full"  
                  style={{ width: `${result.analysis.negative}%` }}  
                />  
              </div>  
            </div>  
          </div>  

          {/* Review Information */}  
          <div className="bg-[#112240] rounded-2xl border border-gray-800 p-6 shadow-xl">  
            <h2 className="font-bold text-gray-400 text-sm uppercase tracking-wider mb-4">  
              Review Information  
            </h2>  

            <div className="space-y-4 font-medium text-sm text-gray-300">  
              <div className="flex justify-between py-2 border-b border-gray-800">  
                <span className="text-gray-400">📊 Reviews Analyzed</span>  
                <b className="text-white">{result.youtube_count}</b>  
              </div>  

              <div className="flex justify-between py-2 border-b border-gray-800">  
                <span className="text-gray-400">🤖 AI Model</span>  
                <b className="text-white">Gemini</b>  
              </div>  

              <div className="flex justify-between py-2">  
                <span className="text-gray-400">⚡ Status</span>  
                <b className="text-green-400 bg-green-950/50 px-2.5 py-0.5 rounded-lg text-xs font-bold border border-green-900">  
                  Completed  
                </b>  
              </div>  
            </div>  
          </div>  

          {/* AI Recommendation */}  
          <div className="bg-[#112240] rounded-2xl border border-gray-800 p-6 shadow-xl">  
            <h2 className="font-bold text-gray-400 text-sm uppercase tracking-wider mb-4">  
              🤖 AI Recommendation  
            </h2>  

            <h1  
              className={`text-2xl font-extrabold ${  
                result.analysis.recommendation.status ===  
                "Worth Buying"  
                  ? "text-green-400"  
                  : result.analysis.recommendation.status ===  
                    "Buy with Caution"  
                  ? "text-yellow-400"  
                  : "text-red-400"  
              }`}  
            >  
              {result.analysis.recommendation.status}  
            </h1>  

            <p className="mt-2 text-sm text-gray-400 font-medium">  
              AI Confidence :  
              <span className="text-white font-bold">  
                {" "}  
                {result.analysis.recommendation.confidence}%  
              </span>  
            </p>  

            <h3 className="font-bold text-sm text-white mt-5 mb-2">  
              Why?  
            </h3>  

            <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-300">  
              {result.analysis.recommendation.reasons.map(  
                (reason: string, index: number) => (  
                  <li key={index}>{reason}</li>  
                )  
              )}  
            </ul>  
          </div>  
        </div>  

        {/* Summary */}  
        <div  
          id="summary"  
          className="bg-[#112240] rounded-2xl border border-gray-800 p-6 mt-6 shadow-xl"  
        >  
          <h2 className="font-bold text-lg text-white mb-4">  
            Summary  
          </h2>  

          <p className="text-gray-300 leading-8 text-sm font-medium">  
            {result.analysis.summary}  
          </p>  
        </div>  

        {/* Keywords */}  
        <div  
          id="keywords"  
          className="bg-[#112240] rounded-2xl border border-gray-800 p-6 mt-6 shadow-xl"  
        >  
          <h2 className="font-bold text-lg text-white mb-4">  
            Top Keywords  
          </h2>  

          <div className="flex flex-wrap gap-2.5">  
            {result.analysis.keywords.map(  
              (keyword: string, index: number) => (  
                <span  
                  key={index}  
                  className="bg-blue-950/60 text-blue-300 border border-blue-900 font-semibold px-4 py-1.5 rounded-xl text-xs"  
                >  
                  {keyword}  
                </span>  
              )  
            )}  
          </div>  
        </div>  

        {/* Pros & Cons */}  
        <div  
          id="proscons"  
          className="grid md:grid-cols-2 gap-6 mt-6"  
        >  
          <div className="bg-[#112240] rounded-2xl border border-gray-800 p-6 shadow-xl">  
            <h2 className="text-green-400 text-lg font-bold mb-4 flex items-center gap-2">  
              ✅ Pros  
            </h2>  

            <ul className="list-disc ml-5 space-y-2 text-sm text-gray-300">  
              {result.analysis.pros.map(  
                (pro: string, index: number) => (  
                  <li key={index}>{pro}</li>  
                )  
              )}  
            </ul>  
          </div>  

          <div className="bg-[#112240] rounded-2xl border border-gray-800 p-6 shadow-xl">  
            <h2 className="text-red-400 text-lg font-bold mb-4 flex items-center gap-2">  
              ❌ Cons  
            </h2>  

            <ul className="list-disc ml-5 space-y-2 text-sm text-gray-300">  
              {result.analysis.cons.map(  
                (con: string, index: number) => (  
                  <li key={index}>{con}</li>  
                )  
              )}  
            </ul>  
          </div>  
        </div>  
      </div> 
    </div> 
  ); 
}