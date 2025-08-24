"use client";

import { useState } from "react";

export default function NewTutorialPage() {
  const [specInput, setSpecInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Call backend /ingest endpoint
      console.log("Submitting spec:", specInput);

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error creating tutorial:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create New Tutorial
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="spec"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              OpenAPI Specification
            </label>
            <textarea
              id="spec"
              value={specInput}
              onChange={(e) => setSpecInput(e.target.value)}
              placeholder="Paste your OpenAPI JSON here or enter a URL..."
              className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Processing..." : "Generate Tutorial"}
          </button>
        </form>
      </div>
    </div>
  );
}
