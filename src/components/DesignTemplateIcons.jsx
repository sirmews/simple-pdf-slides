"use client"

import React from "react"

interface TemplateData {
  id: string
  name: string
  description: string
  category: string
  boxes: Array<{
    id: string
    position: { x: number; y: number }
    size: { width: number; height: number }
    style: {
      shadow: string
      background: string
      border: string
    }
  }>
}

interface TemplateIconProps {
  template: TemplateData
  size?: number
  isSelected?: boolean
  selectionMode?: "radio" | "checkbox"
  onClick?: () => void
}

const TemplateIcon: React.FC<TemplateIconProps> = ({
  template,
  size = 64,
  isSelected = false,
  selectionMode = "radio",
  onClick,
}) => {
  const iconStyle = {
    width: size,
    height: size,
    padding: "8px",
    backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
    border: isSelected ? "2px solid #3b82f6" : "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative" as const,
  }

  const checkboxStyle = {
    position: "absolute" as const,
    top: "4px",
    right: "4px",
    width: "16px",
    height: "16px",
    borderRadius: selectionMode === "radio" ? "50%" : "3px",
    backgroundColor: isSelected ? "#3b82f6" : "#ffffff",
    border: "2px solid #3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    color: "#ffffff",
  }

  const boxStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #d1d5db",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
    borderRadius: "2px",
  }

  const renderIcon = () => {
    const iconSize = size - 16

    switch (template.id) {
      case "single-column":
        return <div style={{ width: iconSize * 0.8, height: iconSize * 0.8, ...boxStyle }} />

      case "two-column":
        return (
          <div style={{ display: "flex", gap: "2px", width: iconSize * 0.8, height: iconSize * 0.8 }}>
            <div style={{ flex: 1, ...boxStyle }} />
            <div style={{ flex: 1, ...boxStyle }} />
          </div>
        )

      case "three-column":
        return (
          <div style={{ display: "flex", gap: "1px", width: iconSize * 0.8, height: iconSize * 0.8 }}>
            <div style={{ flex: 1, ...boxStyle }} />
            <div style={{ flex: 1, ...boxStyle }} />
            <div style={{ flex: 1, ...boxStyle }} />
          </div>
        )

      case "top-bottom":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              width: iconSize * 0.8,
              height: iconSize * 0.8,
            }}
          >
            <div style={{ flex: 1, ...boxStyle }} />
            <div style={{ flex: 1, ...boxStyle }} />
          </div>
        )

      case "grid-2x2":
        return (
          <div
            style={{
              display: "grid",
              gridTemplate: "1fr 1fr / 1fr 1fr",
              gap: "2px",
              width: iconSize * 0.8,
              height: iconSize * 0.8,
            }}
          >
            <div style={boxStyle} />
            <div style={boxStyle} />
            <div style={boxStyle} />
            <div style={boxStyle} />
          </div>
        )

      case "grid-3x3":
        return (
          <div
            style={{
              display: "grid",
              gridTemplate: "1fr 1fr 1fr / 1fr 1fr 1fr",
              gap: "1px",
              width: iconSize * 0.8,
              height: iconSize * 0.8,
            }}
          >
            <div style={boxStyle} />
            <div style={boxStyle} />
            <div style={boxStyle} />
            <div style={boxStyle} />
            <div style={boxStyle} />
            <div style={boxStyle} />
            <div style={boxStyle} />
            <div style={boxStyle} />
            <div style={boxStyle} />
          </div>
        )

      case "header-content-footer":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1px",
              width: iconSize * 0.8,
              height: iconSize * 0.8,
            }}
          >
            <div style={{ height: "20%", ...boxStyle, backgroundColor: "#f9fafb" }} />
            <div style={{ flex: 1, ...boxStyle }} />
            <div style={{ height: "20%", ...boxStyle, backgroundColor: "#f9fafb" }} />
          </div>
        )

      case "sidebar-left":
        return (
          <div style={{ display: "flex", gap: "2px", width: iconSize * 0.8, height: iconSize * 0.8 }}>
            <div style={{ width: "30%", ...boxStyle, backgroundColor: "#f9fafb" }} />
            <div style={{ flex: 1, ...boxStyle }} />
          </div>
        )

      case "sidebar-right":
        return (
          <div style={{ display: "flex", gap: "2px", width: iconSize * 0.8, height: iconSize * 0.8 }}>
            <div style={{ flex: 1, ...boxStyle }} />
            <div style={{ width: "30%", ...boxStyle, backgroundColor: "#f9fafb" }} />
          </div>
        )

      case "hero-cards":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              width: iconSize * 0.8,
              height: iconSize * 0.8,
            }}
          >
            <div style={{ height: "50%", ...boxStyle, backgroundColor: "#f3f4f6" }} />
            <div style={{ display: "flex", gap: "1px", flex: 1 }}>
              <div style={{ flex: 1, ...boxStyle }} />
              <div style={{ flex: 1, ...boxStyle }} />
              <div style={{ flex: 1, ...boxStyle }} />
            </div>
          </div>
        )

      case "masonry":
        return (
          <div style={{ display: "flex", gap: "1px", width: iconSize * 0.8, height: iconSize * 0.8 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1px" }}>
              <div style={{ height: "60%", ...boxStyle }} />
              <div style={{ flex: 1, ...boxStyle }} />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1px" }}>
              <div style={{ height: "40%", ...boxStyle }} />
              <div style={{ flex: 1, ...boxStyle }} />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1px" }}>
              <div style={{ height: "70%", ...boxStyle }} />
              <div style={{ flex: 1, ...boxStyle }} />
            </div>
          </div>
        )

      default:
        return <div style={{ width: iconSize * 0.8, height: iconSize * 0.8, ...boxStyle }} />
    }
  }

  return (
    <div style={iconStyle} onClick={onClick} title={`${template.name} - ${template.description}`}>
      {renderIcon()}
      <div style={checkboxStyle}>{isSelected && (selectionMode === "checkbox" ? "✓" : "●")}</div>
    </div>
  )
}

interface TemplatePickerProps {
  selectionMode?: "radio" | "checkbox"
  onSelectionChange?: (selected: TemplateData | TemplateData[] | null) => void
  initialSelection?: string | string[]
  iconSize?: number
  maxSelections?: number
}

const TemplatePicker: React.FC<TemplatePickerProps> = ({
  selectionMode = "radio",
  onSelectionChange,
  initialSelection = selectionMode === "radio" ? "" : [],
  iconSize = 64,
  maxSelections,
}) => {
  const [selectedTemplates, setSelectedTemplates] = React.useState<string[]>(() => {
    if (selectionMode === "radio") {
      return typeof initialSelection === "string" ? [initialSelection].filter(Boolean) : []
    }
    return Array.isArray(initialSelection) ? initialSelection : []
  })

  const templates: TemplateData[] = [
    {
      id: "single-column",
      name: "Single Column",
      description: "Simple single column layout",
      category: "basic",
      boxes: [
        {
          id: "content",
          position: { x: 0, y: 0 },
          size: { width: 100, height: 80 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
      ],
    },
    {
      id: "two-column",
      name: "Two Column",
      description: "Two side-by-side columns",
      category: "columns",
      boxes: [
        {
          id: "left-column",
          position: { x: 0, y: 0 },
          size: { width: 48, height: 80 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "right-column",
          position: { x: 52, y: 0 },
          size: { width: 48, height: 80 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
      ],
    },
    {
      id: "three-column",
      name: "Three Column",
      description: "Three equal columns side by side",
      category: "columns",
      boxes: [
        {
          id: "left-column",
          position: { x: 0, y: 0 },
          size: { width: 32, height: 80 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "center-column",
          position: { x: 34, y: 0 },
          size: { width: 32, height: 80 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "right-column",
          position: { x: 68, y: 0 },
          size: { width: 32, height: 80 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
      ],
    },
    {
      id: "top-bottom",
      name: "Top and Bottom",
      description: "Two stacked sections",
      category: "stacked",
      boxes: [
        {
          id: "top-section",
          position: { x: 0, y: 0 },
          size: { width: 100, height: 38 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "bottom-section",
          position: { x: 0, y: 42 },
          size: { width: 100, height: 38 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
      ],
    },
    {
      id: "grid-2x2",
      name: "2x2 Grid",
      description: "Four boxes in a 2x2 grid arrangement",
      category: "grid",
      boxes: [
        {
          id: "top-left",
          position: { x: 0, y: 0 },
          size: { width: 48, height: 38 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "top-right",
          position: { x: 52, y: 0 },
          size: { width: 48, height: 38 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "bottom-left",
          position: { x: 0, y: 42 },
          size: { width: 48, height: 38 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "bottom-right",
          position: { x: 52, y: 42 },
          size: { width: 48, height: 38 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
      ],
    },
    {
      id: "header-content-footer",
      name: "Header Content Footer",
      description: "Classic three-section vertical layout",
      category: "structured",
      boxes: [
        {
          id: "header",
          position: { x: 0, y: 0 },
          size: { width: 100, height: 15 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#f3f4f6",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "content",
          position: { x: 0, y: 19 },
          size: { width: 100, height: 50 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "footer",
          position: { x: 0, y: 73 },
          size: { width: 100, height: 15 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#f3f4f6",
            border: "1px solid #e5e7eb",
          },
        },
      ],
    },
    {
      id: "sidebar-left",
      name: "Left Sidebar",
      description: "Left sidebar with main content area",
      category: "sidebar",
      boxes: [
        {
          id: "sidebar",
          position: { x: 0, y: 0 },
          size: { width: 25, height: 80 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "main-content",
          position: { x: 29, y: 0 },
          size: { width: 71, height: 80 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
      ],
    },
    {
      id: "sidebar-right",
      name: "Right Sidebar",
      description: "Main content with right sidebar",
      category: "sidebar",
      boxes: [
        {
          id: "main-content",
          position: { x: 0, y: 0 },
          size: { width: 71, height: 80 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "sidebar",
          position: { x: 75, y: 0 },
          size: { width: 25, height: 80 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
          },
        },
      ],
    },
    {
      id: "hero-cards",
      name: "Hero with Cards",
      description: "Large hero section with card grid below",
      category: "marketing",
      boxes: [
        {
          id: "hero",
          position: { x: 0, y: 0 },
          size: { width: 100, height: 40 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#f3f4f6",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "card-1",
          position: { x: 0, y: 44 },
          size: { width: 32, height: 30 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "card-2",
          position: { x: 34, y: 44 },
          size: { width: 32, height: 30 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "card-3",
          position: { x: 68, y: 44 },
          size: { width: 32, height: 30 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
      ],
    },
    {
      id: "masonry",
      name: "Masonry Layout",
      description: "Staggered height boxes in columns",
      category: "advanced",
      boxes: [
        {
          id: "masonry-1",
          position: { x: 0, y: 0 },
          size: { width: 32, height: 35 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "masonry-2",
          position: { x: 34, y: 0 },
          size: { width: 32, height: 25 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "masonry-3",
          position: { x: 68, y: 0 },
          size: { width: 32, height: 45 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "masonry-4",
          position: { x: 0, y: 39 },
          size: { width: 32, height: 25 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "masonry-5",
          position: { x: 34, y: 29 },
          size: { width: 32, height: 35 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
        {
          id: "masonry-6",
          position: { x: 68, y: 49 },
          size: { width: 32, height: 25 },
          style: {
            shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        },
      ],
    },
  ]

  const handleTemplateClick = (template: TemplateData) => {
    let newSelection: string[]

    if (selectionMode === "radio") {
      newSelection = [template.id]
    } else {
      if (selectedTemplates.includes(template.id)) {
        newSelection = selectedTemplates.filter((id) => id !== template.id)
      } else {
        if (maxSelections && selectedTemplates.length >= maxSelections) {
          return // Don't allow more selections
        }
        newSelection = [...selectedTemplates, template.id]
      }
    }

    setSelectedTemplates(newSelection)

    // Call the callback with the actual template objects
    if (onSelectionChange) {
      if (selectionMode === "radio") {
        const selectedTemplate =
          newSelection.length > 0 ? templates.find((t) => t.id === newSelection[0]) || null : null
        onSelectionChange(selectedTemplate)
      } else {
        const selectedTemplateObjects = templates.filter((t) => newSelection.includes(t.id))
        onSelectionChange(selectedTemplateObjects)
      }
    }
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px", color: "#111827" }}>
        Choose Design Template{selectionMode === "checkbox" ? "s" : ""}
      </h1>
      <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "20px" }}>
        {selectionMode === "radio"
          ? "Select one template to use for your layout"
          : `Select ${maxSelections ? `up to ${maxSelections}` : "multiple"} templates`}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
          gap: "16px",
          maxWidth: "800px",
        }}
      >
        {templates.map((template) => (
          <div key={template.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <TemplateIcon
              template={template}
              size={iconSize}
              isSelected={selectedTemplates.includes(template.id)}
              selectionMode={selectionMode}
              onClick={() => handleTemplateClick(template)}
            />
            <div
              style={{
                fontSize: "12px",
                color: "#6b7280",
                textAlign: "center",
                maxWidth: "80px",
                lineHeight: "1.2",
              }}
            >
              {template.name}
            </div>
          </div>
        ))}
      </div>

      {selectedTemplates.length > 0 && (
        <div
          style={{
            marginTop: "32px",
            padding: "16px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            maxWidth: "600px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", color: "#111827" }}>
            Selected Template{selectedTemplates.length > 1 ? "s" : ""}
          </h3>
          {selectedTemplates.map((templateId) => {
            const template = templates.find((t) => t.id === templateId)
            return template ? (
              <div key={templateId} style={{ marginBottom: "8px" }}>
                <strong style={{ color: "#111827" }}>{template.name}</strong>
                <span style={{ color: "#6b7280", marginLeft: "8px" }}>- {template.description}</span>
              </div>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}

export default TemplatePicker
