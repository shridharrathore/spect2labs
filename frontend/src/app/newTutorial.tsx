"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api";

export default function NewTutorialPage() {
  const [specContent, setSpecContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!specContent.trim()) {
      setError("Please provide an OpenAPI specification");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate JSON
      JSON.parse(specContent);

      const result = await apiClient.ingestSpec(
        specContent,
        sourceUrl || undefined
      );
      setSuccess(`Tutorial created successfully! Guide ID: ${result.guide_id}`);
      setSpecContent("");
      setSourceUrl("");
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError(
          "Invalid JSON format. Please check your OpenAPI specification."
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to create tutorial"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoadExample = () => {
    const exampleSpec = {
      openapi: "3.0.0",
      info: {
        title: "Petstore API",
        version: "1.0.0",
        description: "A sample API for learning purposes",
      },
      paths: {
        "/pets": {
          get: {
            summary: "List all pets",
            responses: {
              "200": {
                description: "A list of pets",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "integer" },
                          name: { type: "string" },
                          type: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    setSpecContent(JSON.stringify(exampleSpec, null, 2));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Create New Tutorial
        </h1>
        <p className="mt-2 text-gray-600">
          Upload an OpenAPI specification to generate an interactive tutorial
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Source URL (Optional) */}
            <div>
              <label
                htmlFor="sourceUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Source URL (Optional)
              </label>
              <input
                type="url"
                id="sourceUrl"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                placeholder="https://api.example.com/openapi.json"
              />
              <p className="mt-2 text-sm text-gray-500">
                If you have a URL to the OpenAPI spec, you can provide it here
              </p>
            </div>

            {/* Spec Content */}
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="specContent"
                  className="block text-sm font-medium text-gray-700"
                >
                  OpenAPI Specification
                </label>
                <button
                  type="button"
                  onClick={handleLoadExample}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Load Example
                </button>
              </div>

              <textarea
                id="specContent"
                rows={20}
                value={specContent}
                onChange={(e) => setSpecContent(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono text-gray-900 bg-white"
                placeholder="Paste your OpenAPI JSON specification here..."
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                💡 Tip: You can paste JSON directly or use the "Load Example"
                button to see the format
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Success!
                    </h3>
                    <div className="mt-2 text-sm text-green-700">{success}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating Tutorial...
                  </>
                ) : (
                  "Generate Tutorial"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
