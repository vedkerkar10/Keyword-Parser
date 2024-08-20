import React, { useEffect, useState } from "react";
import axios from "axios"; // Add axios import

interface TextInputProps {
    onSubmit: (text: string) => void;
    extractedText?: string; // Optional prop for extracted text
    extractedKeywords?: { [key: string]: string }; // Optional prop for extracted keywords
}

const TextInput: React.FC<TextInputProps> = ({ onSubmit, extractedText, extractedKeywords }) => {
    const [text, setText] = useState<string>("");
    const [file, setFile] = useState<File | null>(null); // State for file
    const [domain, setDomain] = useState("");

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DOMAIN) {
      setDomain(process.env.NEXT_PUBLIC_DOMAIN);
    }
  },
  []);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]); // Set the selected file
        }
    };

    const handleUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            try {
                const response = await axios.post(`${domain}/upload`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                setText(response.data.extracted_text); // Set extracted text from response
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(text); // Pass the text to the parent component
    };

    const renderExtractedKeywordsForm = () => {
        return (
            <div className="flex flex-col">
                <h2 className="text-black text-2xl font-bold mb-4">Extracted Keywords</h2>
                {extractedKeywords && Object.entries(extractedKeywords).map(([key, value]) => (
                    <div key={key} className="mb-4">
                        <label className="block text-black text-md font-bold mb-2">{key}</label>
                        <input
                            type="text"
                            value={value}
                            readOnly
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex md:flex-row flex-col gap-16 p-4 bg-white">
            <div className="md:w-1/2 w-full ">
            <form onSubmit={handleSubmit} className="h-auto w-full bg-white p-8 shadow-md rounded mx-2">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={10}
                    className="text-black w-full p-2 border border-gray-300 rounded mb-4"
                    placeholder="Enter text here..."
                />
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-800 transition duration-200"
                >
                    Extract
                </button>
                <input
                    type="file"
                    accept=".pdf, .png, .jpg, .jpeg"
                    onChange={handleFileChange}
                    className="mt-4"
                />
                <button
                    type="button"
                    onClick={handleUpload}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-800 transition duration-200 mt-2"
                >
                    Upload
                </button>
            </form>
            </div>
            <div className="md:w-1/2 w-full">
            {extractedKeywords && renderExtractedKeywordsForm()} {/* Render extracted keywords form if available */}
            </div>
        </div>
    );
};

export default TextInput;