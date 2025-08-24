interface GuidePageProps {
  params: {
    id: string;
  };
}

export default function GuidePage({ params }: GuidePageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-screen">
        {/* Left pane - Instructions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            API Tutorial: {params.id}
          </h1>
          <div className="prose">
            <p>Tutorial instructions will appear here...</p>
            <p>TODO: Load from backend /guides/{params.id}</p>
          </div>
        </div>

        {/* Right pane - Request builder */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Try It Out
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request URL
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="https://api.example.com/users"
              />
            </div>

            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Send Request
            </button>

            <div className="mt-4 p-3 bg-gray-100 rounded">
              <h3 className="font-medium text-gray-700">Response:</h3>
              <pre className="text-sm text-gray-600 mt-2">
                Response will appear here...
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
