import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import PageContainer from "../components/PageContainer";
import { Upload, Download, Image as ImageIcon } from "lucide-react";
import { useProfileBanner } from "../hooks/useProfileBanner";

export const Route = createFileRoute("/profile-banner")({
  component: ProfileBanner,
});

function ProfileBanner() {
  const { isDarkMode } = Route.useRouteContext();
  const { selectedImage, selectedBanner, updateSelectedImage, updateSelectedBanner } = useProfileBanner();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCircleClick = () => {
    fileInputRef.current?.click();
  };

  const toggleBanner = (bannerType: string) => {
    updateSelectedBanner(selectedBanner === bannerType ? null : bannerType);
  };

  const handleSaveImage = async () => {
    if (!selectedImage) return;

    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match the seeking clients banner resolution for optimal quality
    const size = 1680; // Same as seek-clients.png dimensions (1680x1680)
    canvas.width = size;
    canvas.height = size;

    // Enable high-quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Create image object from selected image
    const img = new Image();

    return new Promise<void>((resolve) => {
      img.onload = async () => {
        // Clear canvas with transparent background
        ctx.clearRect(0, 0, size, size);

        // Create circular clipping path
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();

        // Draw the main image, scaled to fit circle
        ctx.drawImage(img, 0, 0, size, size);
        ctx.restore();

        // Add banner overlays if selected
        if (selectedBanner === "seeking-clients") {
          const overlayImg = new Image();
          overlayImg.crossOrigin = "anonymous";

          await new Promise<void>((overlayResolve) => {
            overlayImg.onload = () => {
              // Draw the seeking clients overlay on top
              ctx.save();
              ctx.beginPath();
              ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(overlayImg, 0, 0, size, size);
              ctx.restore();
              overlayResolve();
            };
            overlayImg.onerror = () => overlayResolve(); // Continue even if overlay fails to load
            overlayImg.src = "/assets/seek-clients.png";
          });
        } else if (selectedBanner === "button-effect") {
          ctx.save();

          // Create enhanced button effect without white border
          // Add pronounced shadow (simulate drop shadow by drawing multiple offset circles)
          ctx.globalCompositeOperation = "destination-over";
          for (let i = 0; i < 15; i++) {
            ctx.beginPath();
            ctx.arc(
              size / 2 + i / 2,
              size / 2 + i / 2,
              size / 2 + i,
              0,
              Math.PI * 2,
            );
            ctx.fillStyle = `rgba(0, 0, 0, ${0.15 - i * 0.01})`;
            ctx.fill();
          }
          ctx.globalCompositeOperation = "source-over";

          // Create pronounced inset effect with gradient overlay
          const insetGradient = ctx.createRadialGradient(
            size / 3,
            size / 3,
            0,
            size / 2,
            size / 2,
            size / 2,
          );
          insetGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
          insetGradient.addColorStop(0.7, "rgba(255, 255, 255, 0.1)");
          insetGradient.addColorStop(1, "rgba(0, 0, 0, 0.2)");

          ctx.globalCompositeOperation = "overlay";
          ctx.fillStyle = insetGradient;
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          ctx.fill();

          // Add inner shadow effect
          const innerShadowGradient = ctx.createRadialGradient(
            size / 2,
            size / 2,
            size / 2 - 20,
            size / 2,
            size / 2,
            size / 2,
          );
          innerShadowGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
          innerShadowGradient.addColorStop(0.9, "rgba(0, 0, 0, 0)");
          innerShadowGradient.addColorStop(1, "rgba(0, 0, 0, 0.3)");

          ctx.globalCompositeOperation = "multiply";
          ctx.fillStyle = innerShadowGradient;
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalCompositeOperation = "source-over";
          ctx.restore();
        }

        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "profile-banner.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
          resolve();
        }, "image/png");
      };

      img.src = selectedImage;
    });
  };

  return (
    <PageContainer isDarkMode={isDarkMode}>
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="heading-primary">Kinda professional avatar</h1>
            <p className="text-secondary mt-2">
              Make your LinkedIn profile image stand out and be a little bit
              different from the rest. Not too different and still professional.
            </p>
            <p className="text-secondary mt-2">
              Inspired by{" "}
              <a
                href="https://www.linkedin.com/in/beccapchambers/"
                target="_blank"
                rel="noopener noreferrer"
                className=" bg-purple-600 text-white px-1.5 py-0.5 hover:bg-purple-700 rounded-md"
              >
                Becca Chambers
              </a>{" "}
              and{" "}
              <a
                href="https://www.linkedin.com/in/rachelwescott/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 text-white px-1.5 py-0.5 hover:bg-orange-600 rounded-md"
              >
                Rachel Wescott
              </a>
            </p>
          </div>
        </div>
        <div className="card-content">
          {/* Image Upload and Preview */}
          <div className="flex justify-center mb-8">
            <div
              onClick={handleCircleClick}
              className="relative w-64 h-64 cursor-pointer"
            >
              <div
                className={`w-full h-full rounded-full transition-all duration-200 overflow-hidden ${
                  selectedImage
                    ? ""
                    : isDarkMode
                      ? "bg-gray-700 border-2 border-dashed border-gray-600 hover:border-gray-500"
                      : "bg-gray-50 border-2 border-dashed border-slate-300 hover:border-slate-400"
                }`}
              >
                {selectedImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={selectedImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover rounded-full"
                    />

                    {/* Banner overlays */}
                    {selectedBanner === "seeking-clients" && (
                      <img
                        src="/assets/seek-clients.png"
                        alt="Seeking Clients"
                        className="absolute inset-0 w-full h-full object-cover rounded-full pointer-events-none"
                      />
                    )}

                    {selectedBanner === "button-effect" && (
                      <div className="absolute inset-0 rounded-full pointer-events-none">
                        {/* Enhanced button effect with shadow and depth */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            boxShadow:
                              "0 8px 20px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.2)",
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0.1) 100%)",
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Upload
                      className={`w-12 h-12 mb-4 ${isDarkMode ? "text-gray-400" : "text-slate-400"}`}
                    />
                    <p
                      className={`text-sm ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}
                    >
                      Click to upload image
                    </p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Banner Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">
              Banner Options
            </h3>

            <button
              onClick={() => toggleBanner("seeking-clients")}
              className={`w-full p-4 border-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                selectedBanner === "seeking-clients"
                  ? "border-blue-500 bg-blue-50"
                  : isDarkMode
                    ? "border-gray-600 hover:border-gray-500"
                    : "border-slate-300 hover:border-slate-400"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                #
              </div>
              <div className="text-left">
                <div
                  className={`font-semibold ${
                    selectedBanner === "seeking-clients"
                      ? "text-blue-700"
                      : "text-primary"
                  }`}
                >
                  Seeking Clients Banner
                </div>
                <div
                  className={`text-sm ${
                    selectedBanner === "seeking-clients"
                      ? "text-blue-600"
                      : "text-secondary"
                  }`}
                >
                  Add "#SEEKINGCLIENTS" overlay to your profile
                </div>
              </div>
            </button>

            <button
              onClick={() => toggleBanner("button-effect")}
              className={`w-full p-4 border-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                selectedBanner === "button-effect"
                  ? "border-blue-500 bg-blue-50"
                  : isDarkMode
                    ? "border-gray-600 hover:border-gray-500"
                    : "border-slate-300 hover:border-slate-400"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                ⚪
              </div>
              <div className="text-left">
                <div
                  className={`font-semibold ${
                    selectedBanner === "button-effect"
                      ? "text-blue-700"
                      : "text-primary"
                  }`}
                >
                  Button Effect
                </div>
                <div
                  className={`text-sm ${
                    selectedBanner === "button-effect"
                      ? "text-blue-600"
                      : "text-secondary"
                  }`}
                >
                  Add professional button-like border and shadow
                </div>
              </div>
            </button>
          </div>

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-secondary">
            <button
              onClick={handleSaveImage}
              disabled={!selectedImage}
              className="btn-primary w-full"
            >
              <Download className="w-5 h-5 mr-3" />
              Save Profile Banner
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
