import React, { useState } from "react";

interface TextInputProps {
    onSubmit: (text: string) => void;
    extractedText?: string; // Optional prop for extracted text
    extractedKeywords?: { [key: string]: string }; // Optional prop for extracted keywords
}

const TextInput: React.FC<TextInputProps> = ({ onSubmit, extractedText, extractedKeywords }) => {
    const [text, setText] = useState<string>("");

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
            </form>
            </div>
            <div className="md:w-1/2 w-full">
            {extractedKeywords && renderExtractedKeywordsForm()} {/* Render extracted keywords form if available */}
            </div>
        </div>
    );
};

export default TextInput;