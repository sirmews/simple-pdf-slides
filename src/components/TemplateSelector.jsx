import React from "react"

const TemplateSelector = ({ selectedTemplate, onTemplateChange, size = 48 }) => {
  const templates = [
    {
      id: "simple",
      name: "Simple",
      description: "Clean single-column layout",
      preview: () => (
        <div style={{
          width: size - 8,
          height: size - 8,
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "2px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3px",
          gap: "2px"
        }}>
          {/* Title line */}
          <div style={{
            width: "80%",
            height: "2px",
            backgroundColor: "#374151",
            borderRadius: "1px"
          }} />
          {/* Image placeholder */}
          <div style={{
            width: "16px",
            height: "10px",
            backgroundColor: "#f3f4f6",
            border: "1px solid #d1d5db",
            borderRadius: "1px",
            position: "relative",
            margin: "1px 0"
          }}>
            {/* Small image icon */}
            <div style={{
              position: "absolute",
              top: "1px",
              left: "2px",
              width: "3px",
              height: "3px",
              backgroundColor: "#9ca3af",
              borderRadius: "50%"
            }} />
            <div style={{
              position: "absolute",
              bottom: "1px",
              left: "1px",
              right: "1px",
              height: "2px",
              backgroundColor: "#d1d5db",
              borderRadius: "0 0 1px 1px"
            }} />
          </div>
          {/* Content lines */}
          <div style={{
            width: "90%",
            height: "1.5px",
            backgroundColor: "#d1d5db",
            borderRadius: "1px"
          }} />
          <div style={{
            width: "70%",
            height: "1.5px",
            backgroundColor: "#d1d5db",
            borderRadius: "1px"
          }} />
        </div>
      )
    },
    {
      id: "split",
      name: "Split",
      description: "Two-column layout with image",
      preview: () => (
        <div style={{
          width: size - 8,
          height: size - 8,
          display: "flex",
          gap: "2px"
        }}>
          {/* Left column - text lines */}
          <div style={{
            flex: 1,
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "2px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "2px"
          }}>
            {/* Title line - darker/bolder */}
            <div style={{
              height: "2px",
              backgroundColor: "#374151",
              marginBottom: "2px",
              borderRadius: "1px",
              width: "90%"
            }} />
            {/* Content lines - lighter */}
            <div style={{
              height: "1.5px",
              backgroundColor: "#d1d5db",
              marginBottom: "1px",
              borderRadius: "1px",
              width: "80%"
            }} />
            <div style={{
              height: "1.5px",
              backgroundColor: "#d1d5db",
              borderRadius: "1px",
              width: "60%"
            }} />
          </div>
          {/* Right column - image placeholder */}
          <div style={{
            flex: 1,
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{
              width: "12px",
              height: "8px",
              backgroundColor: "#f3f4f6",
              border: "1px solid #d1d5db",
              borderRadius: "1px",
              position: "relative"
            }}>
              {/* Small image icon */}
              <div style={{
                position: "absolute",
                top: "1px",
                left: "1px",
                width: "3px",
                height: "3px",
                backgroundColor: "#9ca3af",
                borderRadius: "50%"
              }} />
              <div style={{
                position: "absolute",
                bottom: "1px",
                left: "1px",
                right: "1px",
                height: "2px",
                backgroundColor: "#d1d5db",
                borderRadius: "0 0 1px 1px"
              }} />
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="flex gap-2">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onTemplateChange(template.id)}
          className={`
            flex flex-col items-center gap-1 p-2 rounded-md border transition-colors
            ${selectedTemplate === template.id
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500"
            }
          `}
          title={template.description}
        >
          <div
            style={{
              width: size,
              height: size,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f9fafb",
              borderRadius: "4px",
              border: "1px solid #e5e7eb"
            }}
          >
            {template.preview()}
          </div>
          <span className="sr-only">
            {template.name}
          </span>
        </button>
      ))}
    </div>
  )
}

export default TemplateSelector