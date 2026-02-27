import { useState } from "react";
import { Button, Card, Badge, Chip, Input } from "../components/ui";
import { Search, Plus, Heart, Trash2, Send } from "lucide-react";

/**
 * Component Showcase
 *
 * Demo page to test and showcase all UI components
 * Navigate to /components to see this page
 */
export default function ComponentShowcase() {
  const [loading, setLoading] = useState(false);
  const [chips, setChips] = useState(["React", "JavaScript", "TypeScript"]);
  const [selectedChips, setSelectedChips] = useState(["React"]);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const toggleChip = (chip) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip],
    );
  };

  const removeChip = (chipToRemove) => {
    setChips((prev) => prev.filter((c) => c !== chipToRemove));
    setSelectedChips((prev) => prev.filter((c) => c !== chipToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            UI Component Showcase
          </h1>
          <p className="text-xl text-gray-600">
            Testing the new purple design system
          </p>
        </div>

        {/* Buttons */}
        <Card>
          <Card.Header>
            <Card.Title>Buttons</Card.Title>
            <Card.Description>
              Multiple variants, sizes, and states
            </Card.Description>
          </Card.Header>

          <Card.Content>
            <div className="space-y-6">
              {/* Variants */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Variants
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="danger">Danger Button</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Sizes
                </h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  With Icons
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Button leftIcon={<Plus size={20} />}>Add Job</Button>
                  <Button rightIcon={<Send size={20} />}>
                    Send Application
                  </Button>
                  <Button variant="danger" leftIcon={<Trash2 size={20} />}>
                    Delete
                  </Button>
                </div>
              </div>

              {/* States */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  States
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleLoadingDemo} loading={loading}>
                    {loading ? "Loading..." : "Click to Load"}
                  </Button>
                  <Button disabled>Disabled Button</Button>
                  <Button fullWidth>Full Width Button</Button>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Cards */}
        <Card>
          <Card.Header>
            <Card.Title>Cards</Card.Title>
            <Card.Description>
              Container component with hover effects
            </Card.Description>
          </Card.Header>

          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card padding="md" hoverable>
                <Card.Title>Hoverable Card</Card.Title>
                <Card.Description>
                  Hover over me to see the lift effect!
                </Card.Description>
              </Card>

              <Card
                padding="md"
                clickable
                onClick={() => alert("Card clicked!")}
              >
                <Card.Title>Clickable Card</Card.Title>
                <Card.Description>
                  I'm clickable! Try clicking me.
                </Card.Description>
              </Card>

              <Card padding="md">
                <Card.Title>Regular Card</Card.Title>
                <Card.Description>
                  Just a regular card with no special effects.
                </Card.Description>
                <Card.Footer>
                  <Button variant="ghost" size="sm">
                    Learn More
                  </Button>
                </Card.Footer>
              </Card>
            </div>
          </Card.Content>
        </Card>

        {/* Badges */}
        <Card>
          <Card.Header>
            <Card.Title>Badges</Card.Title>
            <Card.Description>Status indicators and labels</Card.Description>
          </Card.Header>

          <Card.Content>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Variants
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="neutral">Neutral</Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  With Dot Indicator
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success" dot>
                    Active
                  </Badge>
                  <Badge variant="warning" dot>
                    Pending
                  </Badge>
                  <Badge variant="error" dot>
                    Rejected
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Sizes
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Chips */}
        <Card>
          <Card.Header>
            <Card.Title>Chips</Card.Title>
            <Card.Description>Interactive filters and tags</Card.Description>
          </Card.Header>

          <Card.Content>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Selectable Chips (Click to toggle)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <Chip
                      key={chip}
                      selected={selectedChips.includes(chip)}
                      onClick={() => toggleChip(chip)}
                    >
                      {chip}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Removable Chips (Click X to remove)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <Chip
                      key={chip}
                      selected={selectedChips.includes(chip)}
                      removable
                      onRemove={() => removeChip(chip)}
                    >
                      {chip}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Sizes
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Chip size="sm">Small Chip</Chip>
                  <Chip size="md" selected>
                    Medium Chip
                  </Chip>
                  <Chip size="lg">Large Chip</Chip>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Inputs */}
        <Card>
          <Card.Header>
            <Card.Title>Inputs</Card.Title>
            <Card.Description>
              Form input fields with various states
            </Card.Description>
          </Card.Header>

          <Card.Content>
            <div className="space-y-4 max-w-md">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                helperText="We'll never share your email"
              />

              <Input
                label="Search Jobs"
                type="text"
                placeholder="e.g., Frontend Developer"
                leftIcon={<Search size={20} />}
              />

              <Input
                label="Favorite"
                type="text"
                placeholder="Add to favorites"
                rightIcon={<Heart size={20} />}
              />

              <Input
                label="Invalid Input"
                type="text"
                placeholder="This has an error"
                error="This field is required"
              />

              <Input
                label="Disabled Input"
                type="text"
                placeholder="Cannot edit"
                disabled
              />
            </div>
          </Card.Content>
        </Card>

        {/* Color Palette */}
        <Card>
          <Card.Header>
            <Card.Title>Purple Color Palette</Card.Title>
            <Card.Description>Twitch purple theme</Card.Description>
          </Card.Header>

          <Card.Content>
            <div className="grid grid-cols-5 gap-4">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                (shade) => (
                  <div key={shade} className="text-center">
                    <div
                      className={`h-16 rounded-lg mb-2 bg-primary-${shade}`}
                      style={{ backgroundColor: `var(--purple-${shade})` }}
                    />
                    <p className="text-sm font-medium text-gray-700">{shade}</p>
                  </div>
                ),
              )}
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
