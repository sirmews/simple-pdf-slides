# Drag-and-Drop Integration Guide for PDF Slide Reordering

This document outlines the process and key learnings from implementing a proof-of-concept (POC) for a drag-and-drop interface to reorder PDF slides in the application.

## 1. Core Concept & Approach

The initial challenge was understanding how to apply drag-and-drop to `@react-pdf/renderer` components.

**The key learning is that you cannot directly manipulate `react-pdf` elements in the DOM.** The library renders directly to a PDF stream, not to standard HTML elements that drag-and-drop libraries can interact with.

The correct approach is to **separate the user interface from the PDF generation logic**:

1.  **UI Layer:** Implement drag-and-drop on the React components that serve as the *controls* for the PDF pages (in our case, the `PageInput` components).
2.  **State Management:** When the user drags and drops a component, the action reorders an array in the React state (the `pages` array).
3.  **PDF Generation:** When the user clicks "Generate PDF," the `@react-pdf/renderer` library takes the final, reordered `pages` array from the state and generates the PDF accordingly.

## 2. Technology Selection

-   **Drag-and-Drop Library:** We chose **`@dnd-kit`**. It is a modern, lightweight, and highly flexible toolkit for React. It is actively maintained and offers better accessibility and customizability compared to older libraries like `react-beautiful-dnd`.
-   **Unique ID Generation:** We used **`nanoid`** to generate unique, stable IDs for each page item, which is a requirement for `@dnd-kit`'s sorting context.

## 3. Step-by-Step Implementation

The following steps were taken to build the POC.

### Step 1: Install Dependencies

The following packages were installed:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/modifiers nanoid
```

### Step 2: Ensure Unique IDs for Data

`@dnd-kit` requires every sortable item to have a unique `id`.

-   **In `App.jsx` (or `App.poc.jsx`):**
    -   Modified the `loadSavedData` function to add a unique `id` using `nanoid()` to each page object when it's first loaded.
    -   Modified the `handleAddPage` function to ensure any new page added to the state also receives a unique `id`.

**Example (`handleAddPage`):**
```javascript
import { nanoid } from 'nanoid';

const handleAddPage = () => {
  setPages(prevPages => [
    ...prevPages,
    { id: nanoid(), title: "", content: "", ... }
  ]);
};
```

### Step 3: Set Up the Drag-and-Drop Context (`App.jsx`)

The list of sortable items needs to be wrapped in context providers from `@dnd-kit`.

-   **Imports:**
    ```javascript
    import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
    import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
    import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
    ```
-   **Component Wrapper:** The list of `PageInput` components was wrapped as follows:
    ```jsx
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext 
        items={pages}
        strategy={verticalListSortingStrategy}
      >
        {pages.map((page, index) => (
          <PageInput key={page.id} id={page.id} ... />
        ))}
      </SortableContext>
    </DndContext>
    ```
-   **Sensors and Drag Handler:** Added the `sensors` setup and the `handleDragEnd` function to manage the state update.
    ```javascript
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    function handleDragEnd(event) {
      const { active, over } = event;
      if (active.id !== over.id) {
        setPages((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
    ```

### Step 4: Make the Page Component Draggable (`PageInput.jsx`)

The `PageInput` component was modified to be aware of the drag-and-drop context.

-   **Imports:**
    ```javascript
    import { useSortable } from '@dnd-kit/sortable';
    import { CSS } from '@dnd-kit/utilities';
    import { GripVertical } from "lucide-react";
    ```
-   **`useSortable` Hook:** The hook provides the necessary properties to make the component draggable.
    ```javascript
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: props.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    ```
-   **DOM Attributes:**
    -   The main wrapper `div` receives `ref={setNodeRef}` and `style={style}`.
    -   A "drag handle" button was added, which receives the `{...attributes}` and `{...listeners}` props. This makes the component draggable only via the handle.
    ```jsx
    <div ref={setNodeRef} style={style}>
      <button {...attributes} {...listeners}>
        <GripVertical />
      </button>
      {/* ... rest of the component */}
    </div>
    ```

## 4. Troubleshooting & Key Learnings

-   **Dependency Error:** The app crashed because `@dnd-kit/modifiers` was not installed.
    -   **Solution:** It must be installed as a separate package: `npm install @dnd-kit/modifiers`.
-   **Import Errors:**
    -   An initial typo (`' @dnd-kit/modifiers'`) caused a resolution failure.
    -   The modifiers were incorrectly imported with PascalCase (e.g., `RestrictToVerticalAxis`).
    -   **Solution:** Modifiers are functions and should be imported with camelCase (e.g., `restrictToVerticalAxis`).

## 5. Next Steps

The POC is complete and committed to the `feat/drag-and-drop-poc` branch. The next steps are:

1.  Apply the logic from the `poc/` files to the main application files (`src/App.jsx` and `src/components/PageInput.jsx`).
2.  Thoroughly test the functionality in the main application.
3.  Remove the `poc/` directory and the `poc.html` entry point.
4.  Commit the final, integrated changes.
