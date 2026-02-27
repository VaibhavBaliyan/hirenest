import { Spinner, LoadingOverlay, InlineLoader } from "../components/ui";

export default function SpinnerShowcase() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Loading Components
          </h1>
          <p className="text-gray-600">
            Spinner, LoadingOverlay, and InlineLoader examples
          </p>
        </div>

        {/* Spinner Sizes */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Spinner Sizes</h2>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <Spinner size="sm" />
              <p className="mt-2 text-sm text-gray-600">Small</p>
            </div>
            <div className="text-center">
              <Spinner size="md" />
              <p className="mt-2 text-sm text-gray-600">Medium</p>
            </div>
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-2 text-sm text-gray-600">Large</p>
            </div>
            <div className="text-center">
              <Spinner size="xl" />
              <p className="mt-2 text-sm text-gray-600">Extra Large</p>
            </div>
          </div>
        </section>

        {/* Spinner Variants */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Spinner Variants</h2>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <Spinner variant="primary" size="lg" />
              <p className="mt-2 text-sm text-gray-600">Primary</p>
            </div>
            <div className="text-center bg-gray-900 p-4 rounded">
              <Spinner variant="white" size="lg" />
              <p className="mt-2 text-sm text-white">White</p>
            </div>
            <div className="text-center text-blue-600">
              <Spinner variant="current" size="lg" />
              <p className="mt-2 text-sm">Current Color</p>
            </div>
          </div>
        </section>

        {/* Inline Loader */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Inline Loader</h2>
          <InlineLoader />
        </section>

        {/* Usage Example */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Usage</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {`import { Spinner, LoadingOverlay, InlineLoader } from '@/components/ui';

// Basic Spinner
<Spinner size="md" variant="primary" />

// Full Screen Loading
<LoadingOverlay message="Loading..." size="lg" />

// Inline Loader
<InlineLoader />

// Custom Spinner
<Spinner size="xl" variant="current" className="text-blue-500" />`}
          </pre>
        </section>
      </div>
    </div>
  );
}
