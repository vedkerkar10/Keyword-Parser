"use client";

import axios from "axios";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import TextInput from "./components/TextInput";



export default function Home() {

  const [extractedKeywords, setExtractedKeywords] = useState<{ [key: string]: string }>({});
  const [extractedText, setExtractedText] = useState<string>("");
  const [domain, setDomain] = useState("");

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DOMAIN) {
      setDomain(process.env.NEXT_PUBLIC_DOMAIN);
    }
  },
  []);

  console.log(domain);

  const handleTextSubmit = async (text: string) => {
    try {
      const response = await axios.post(`${domain}/extract`, { text });
      setExtractedKeywords(response.data);
    } catch (error) {
      console.error("Error extracting keywords:", error);
    }
  };


  return (
    <>
      <div className="w-full h-screen bg-white">
        <Navbar />
        <TextInput onSubmit={handleTextSubmit} extractedText={extractedText} extractedKeywords={extractedKeywords} />
      </div>
    </>
  );
}
