"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError(null);

      let videoId = "";
      let analysisRes;

      // YouTube URL Check
      if (query.includes("youtube.com") || query.includes("youtu.be")) {
        if (query.includes("v=")) {
          videoId = query.split("v=")[1].split("&")[0];
        } else {
          videoId = query.split("/").pop() || "";
        }

        analysisRes = await fetch(`https://ai-review-platform-production.up.railway.app/analyze/${videoId}`);
      } else {
        analysisRes = await fetch(`https://ai-review-platform-production.up.railway.app/analyze-product/${query}`);
      }

      const analysis = await analysisRes.json();

      if (analysis.error) {
        setError(analysis.error);
        setLoading(false);
        return;
      }
      console.log(analysis);

      localStorage.setItem(
        "analysis",
        JSON.stringify({
          query,
          result: analysis,
        })
      );
      
      router.push("/dashboard");

    } catch (err) {
      setError("Analysis failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">  {/* Hero — tuned for 13" (~1280×800) at 100% zoom */}
      <div className={`min-h-screen flex flex-col bg-gradient-to-r from-blue-950 via-indigo-950 to-purple-900 text-white  overflow-hidden`}>    
        <nav className="flex shrink-0 items-center justify-between px-5 py-3">    
          <h1 className="text-base font-bold lg:text-lg">AI Review Platform</h1>    
        
          <div className="flex items-center gap-3 text-xs lg:gap-5 lg:text-sm">    
            <a href="#features" className="hidden lg:inline hover:text-violet-300">Features</a>
            <a href="#how-it-works" className="hidden lg:inline hover:text-violet-300">How it Works</a>
            <a href="#about" className="hidden lg:inline hover:text-violet-300">About</a>     
          </div>    
        </nav>    
        
        <div className="flex flex-1 flex-col items-center justify-center text-center px-5 pb-4">    
          <div className="border border-blue-600 px-3 py-1 rounded-full text-[11px] text-violet-300 lg:text-xs">    
            AI-Powered Review Intelligence    
          </div>    
        
          <h1 className="text-[1.75rem] leading-tight font-bold mt-3 lg:text-4xl lg:mt-4">    
            Understand What People    
            <br />    
            <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">    
              Really Think    
            </span>    
          </h1>    
        
          <p className="mt-3 text-gray-300 text-xs max-w-md leading-5 lg:text-sm lg:max-w-lg lg:leading-6">    
            Analyze reviews from YouTube, Reddit and more — sentiment, aspects,    
            spam filtering & fake review detection.    
          </p>    
        
          <div className="bg-white w-full max-w-md rounded-xl p-1.5 flex gap-1.5 mt-4 shadow-2xl lg:max-w-lg lg:rounded-2xl lg:p-2 lg:mt-5">    
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Product name, YouTube link or topic..."
              className="flex-1 min-w-0 outline-none text-black px-3 py-2 text-xs rounded-lg lg:px-4"
            /> 
            <button onClick={handleAnalyze}disabled={loading}className="shrink-0 bg-violet-500 hover:bg-violet-600 px-4 py-2 rounded-lg text-xs lg:px-5 lg:text-sm disabled:opacity-60">
  {loading ? "Analyzing..." : "Analyze Now"}
</button>  
          </div>  
          {loading && (
  <p className="mt-4 text-violet-300 animate-pulse">
    🤖 AI is analyzing reviews...
  </p>
  
)}  
{error && (
  <div className="mt-4 bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-xl">
    ❌ {error}
  </div>
)}
        
          <div className="flex flex-wrap justify-center gap-1.5 mt-3 lg:gap-2 lg:mt-4">    
            <button className="bg-white/10 px-2.5 py-1 rounded-full text-[11px] lg:px-3 lg:py-1.5 lg:text-xs">    
              iPhone 15 Review    
            </button>    
            <button className="bg-white/10 px-2.5 py-1 rounded-full text-[11px] lg:px-3 lg:py-1.5 lg:text-xs">    
              Samsung S24 Ultra    
            </button>    
            <button className="bg-white/10 px-2.5 py-1 rounded-full text-[11px] lg:px-3 lg:py-1.5 lg:text-xs">    
              AirPods Pro 2    
            </button>    
            <button className="bg-white/10 px-2.5 py-1 rounded-full text-[11px] lg:px-3 lg:py-1.5 lg:text-xs">    
              Tesla Model 3    
            </button>    
          </div>    
        </div>
      </div>

      <section
        id="features"
        className="relative overflow-hidden bg-gradient-to-br from-[#071A52] via-[#1E3A8A] to-[#4F46E5] py-16 px-6"
      >
        <div className="absolute -top-32 left-0 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block bg-white/10 border border-white/20 text-cyan-300 px-5 py-2 rounded-full text-sm backdrop-blur-md">
              ✨ AI Powered Features
            </span>
            <h2 className="text-5xl md:text-6xl font-extrabold text-white mt-6 leading-tight">
              Everything You Need
            </h2>
            <p className="text-blue-100 text-lg mt-5 max-w-2xl mx-auto leading-8">
              Analyze thousands of real customer reviews within seconds using AI and
              make smarter purchasing decisions with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="group rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-2xl shadow-lg">😊</div>
              <h3 className="text-white group-hover:text-black text-xl font-bold mt-6">Overall Sentiment</h3>
              <p className="text-blue-100 group-hover:text-gray-600 mt-3 leading-7">Instantly understand whether customer opinion is positive or negative.</p>
            </div>

            <div className="group rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-violet-500 flex items-center justify-center text-2xl shadow-lg">🤖</div>
              <h3 className="text-white group-hover:text-black text-xl font-bold mt-6">AI Recommendation</h3>
              <p className="text-blue-100 group-hover:text-gray-600 mt-3 leading-7">AI suggests whether the product is worth buying based on review trends.</p>
            </div>

            <div className="group rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center text-2xl shadow-lg">📝</div>
              <h3 className="text-white group-hover:text-black text-xl font-bold mt-6">AI Summary</h3>
              <p className="text-blue-100 group-hover:text-gray-600 mt-3 leading-7">Read an intelligent summary instead of hundreds of comments.</p>
            </div>

            <div className="group rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500 flex items-center justify-center text-2xl shadow-lg">🔑</div>
              <h3 className="text-white group-hover:text-black text-xl font-bold mt-6">Top Keywords</h3>
              <p className="text-blue-100 group-hover:text-gray-600 mt-3 leading-7">Discover the topics customers discuss the most.</p>
            </div>

            <div className="group rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-pink-500 flex items-center justify-center text-2xl shadow-lg">👍👎</div>
              <h3 className="text-white group-hover:text-black text-xl font-bold mt-6">Pros & Cons</h3>
              <p className="text-blue-100 group-hover:text-gray-600 mt-3 leading-7">Quickly identify the biggest strengths and weaknesses.</p>
            </div>

            <div className="group rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-2xl shadow-lg">📄</div>
              <h3 className="text-white group-hover:text-black text-xl font-bold mt-6">Download Report</h3>
              <p className="text-blue-100 group-hover:text-gray-600 mt-3 leading-7">Export your complete AI analysis with a single click.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center">How It Works</h2>
          <p className="text-center text-gray-500 mt-4 mb-16">Three simple steps to analyze any product.</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-violet-600 text-white text-3xl flex items-center justify-center mx-auto">1</div>
              <h3 className="font-bold text-xl mt-6">Search Product</h3>
              <p className="text-gray-600 mt-3">Enter a product name and start analysis.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-violet-600 text-white text-3xl flex items-center justify-center mx-auto">2</div>
              <h3 className="font-bold text-xl mt-6">AI Processing</h3>
              <p className="text-gray-600 mt-3">Gemini AI analyzes real customer reviews.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-violet-600 text-white text-3xl flex items-center justify-center mx-auto">3</div>
              <h3 className="font-bold text-xl mt-6">Smart Insights</h3>
              <p className="text-gray-600 mt-3">View sentiment, recommendation, keywords and summary instantly.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="bg-gray-900 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold">About AI Review Platform</h2>
          <p className="text-gray-300 mt-8 leading-8 text-lg">
            Developed by <span className="font-semibold text-violet-400">Roshan Kumar E</span>, AI Review Platform is an intelligent review analysis system built using Next.js, FastAPI, Gemini AI, and the YouTube Data API. Instead of reading hundreds of reviews manually, users receive instant sentiment analysis, AI-powered buying recommendations, concise summaries, top keywords, and key pros & cons through a clean and modern dashboard.
          </p>
        </div>
      </section>
    </div>  
  );
}