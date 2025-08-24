"use client";

import { useState, useEffect } from "react";
import { apiClient, OpenAPISpec, TutorialGuide } from "@/lib/api";

export default function HomePage() {
  const [specs, setSpecs] = useState<OpenAPISpec[]>([]);
  const [guides, setGuides] = useState<TutorialGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specsData, guidesData] = await Promise.all([
          apiClient.getSpecs(),
          apiClient.getGuides(),
        ]);
        setSpecs(specsData.specs);
        setGuides(guidesData.guides);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Connection Error
              </h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
              <div className="mt-2 text-sm text-red-600">
                Make sure the backend is running on http://localhost:8000
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🚀 Turn Your API Specs Into
          <br />
          Interactive Tutorials
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload an OpenAPI/Swagger specification and get a step-by-step
          learning guide with automatic validation.
        </p>
        <a
          href="/new"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Create New Tutorial
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📊</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    API Specifications
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {specs.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📖</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tutorial Guides
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {guides.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tutorials */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Tutorials
          </h3>

          {guides.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tutorials yet
              </h3>
              <p className="text-gray-500 mb-4">
                Upload your first OpenAPI spec to get started!
              </p>
              <a
                href="/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Create Tutorial
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {guides.map((guide) => (
                <div
                  key={guide.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        📖 {guide.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {guide.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        🕒 {new Date(guide.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          guide.status === "ready"
                            ? "bg-green-100 text-green-800"
                            : guide.status === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {guide.status}
                      </span>
                      {guide.status === "ready" && (
                        <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200">
                          ▶️ Start Tutorial
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="text-center">
          <div className="text-3xl mb-3">📤</div>
          <h3 className="text-lg font-medium text-gray-900">Upload Specs</h3>
          <p className="text-gray-500">
            Paste OpenAPI/Swagger JSON or provide a URL
          </p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-3">🤖</div>
          <h3 className="text-lg font-medium text-gray-900">AI Generation</h3>
          <p className="text-gray-500">
            Automatically generate step-by-step tutorials
          </p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-3">✅</div>
          <h3 className="text-lg font-medium text-gray-900">Auto Validation</h3>
          <p className="text-gray-500">Real-time validation of API requests</p>
        </div>
      </div>
    </div>
  );
}
