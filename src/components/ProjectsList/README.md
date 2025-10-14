# ProjectsList Component

A reusable component for displaying a list of projects with a clean, organized layout.

## Usage

```jsx
import ProjectsList from '../../components/ProjectsList';

const projects = [
  { title: "Project Name", location: "Location" },
  { title: "Another Project", location: "City, State" },
  // ... more projects
];

<ProjectsList 
  title="Featured Projects"
  subtitle="Optional subtitle describing the projects"
  projects={projects}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` or `JSX` | No | Section title. Can include JSX for formatting (e.g., `<br />`) |
| `subtitle` | `string` | No | Optional subtitle text below the title |
| `projects` | `array` | Yes | Array of project objects |

## Project Object Structure

Each project in the `projects` array should have:

```javascript
{
  title: string,    // Project name/title
  location: string  // Project location
}
```

## Example

```jsx
const geotechnicalProjects = [
  { title: "BWI Airport Concourse E", location: "Maryland" },
  { title: "DC 295/I-295 Near Term Improvements", location: "Washington, DC" },
  { title: "Foxcroft Mall", location: "Martinsburg, West Virginia" }
];

<ProjectsList 
  title={<>Featured Geotechnical<br />Engineering Projects</>}
  subtitle="A selection of our notable projects across various sectors"
  projects={geotechnicalProjects}
/>
```

## Features

- Responsive 2-column grid on tablet and desktop
- Single column on mobile
- Hover effects on each project item
- Checkmark icon indicator
- Clean, minimalist design
- Automatic bottom borders between items
