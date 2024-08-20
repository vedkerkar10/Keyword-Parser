"use client";

import axios from "axios";

import { useState } from "react";
import Navbar from "./components/Navbar";
import TextInput from "./components/TextInput";



export default function Home() {

  const [extractedKeywords, setExtractedKeywords] = useState<{ [key: string]: string }>({});
  const [extractedText, setExtractedText] = useState<string>("");

  const handleTextSubmit = async (text: string) => {
    try {
      const response = await axios.post("http://localhost:5000/extract", { text });
      setExtractedKeywords(response.data);
    } catch (error) {
      console.error("Error extracting keywords:", error);
    }
  };

  
  return (
    <>
    <Navbar />
    <TextInput onSubmit={handleTextSubmit} extractedText={extractedText} extractedKeywords={extractedKeywords} />

    </>
  );
}
