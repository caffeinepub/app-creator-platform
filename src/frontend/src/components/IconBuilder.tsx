import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Palette } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  ICON_SHAPES_LIBRARY,
  type SVGShapeDefinition,
} from "../data/iconShapes";

export interface IconConfig {
  shapeId: string;
  fgColor: string;
  bgColor: string;
}

interface IconBuilderProps {
  onSave?: (config: IconConfig) => void;
}

function renderShapeSVG(
  shape: SVGShapeDefinition,
  fgColor: string,
  bgColor: string,
  size = 200,
): string {
  const content = shape.svgContent
    .replace(/fill="FG"/g, `fill="${fgColor}"`)
    .replace(/fill="BG"/g, `fill="${bgColor}"`)
    .replace(/stroke="FG"/g, `stroke="${fgColor}"`)
    .replace(/stroke="BG"/g, `stroke="${bgColor}"`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}">${content}</svg>`;
}

export function renderIconSVG(config: IconConfig, size = 200): string {
  const shape = ICON_SHAPES_LIBRARY.find((s) => s.id === config.shapeId);
  if (!shape) return "";
  return renderShapeSVG(shape, config.fgColor, config.bgColor, size);
}

const CATEGORIES = ["Animals", "Geometric", "Characters"] as const;

export default function IconBuilder({ onSave }: IconBuilderProps) {
  const [selectedShape, setSelectedShape] = useState<SVGShapeDefinition>(
    ICON_SHAPES_LIBRARY[0],
  );
  const [fgColor, setFgColor] = useState(ICON_SHAPES_LIBRARY[0].defaultFgColor);
  const [bgColor, setBgColor] = useState(ICON_SHAPES_LIBRARY[0].defaultBgColor);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user-icon-config");
    if (stored) {
      try {
        const config: IconConfig = JSON.parse(stored);
        const shape = ICON_SHAPES_LIBRARY.find((s) => s.id === config.shapeId);
        if (shape) {
          setSelectedShape(shape);
          setFgColor(config.fgColor);
          setBgColor(config.bgColor);
        }
      } catch {
        /* ignore */
      }
    }
  }, []);

  const handleSelectShape = (shape: SVGShapeDefinition) => {
    setSelectedShape(shape);
    setFgColor(shape.defaultFgColor);
    setBgColor(shape.defaultBgColor);
    setSaved(false);
  };

  const handleSave = () => {
    const config: IconConfig = { shapeId: selectedShape.id, fgColor, bgColor };
    localStorage.setItem("user-icon-config", JSON.stringify(config));
    setSaved(true);
    onSave?.(config);
    setTimeout(() => setSaved(false), 2000);
  };

  const previewSVG = renderShapeSVG(selectedShape, fgColor, bgColor, 180);

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Shape Picker */}
        <div className="flex-1 min-w-0">
          <Tabs defaultValue="Animals">
            <TabsList className="w-full mb-3">
              {CATEGORIES.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="flex-1 text-xs">
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
            {CATEGORIES.map((cat) => (
              <TabsContent key={cat} value={cat}>
                <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
                  {ICON_SHAPES_LIBRARY.filter((s) => s.category === cat).map(
                    (shape) => {
                      const miniSVG = renderShapeSVG(
                        shape,
                        shape.defaultFgColor,
                        shape.defaultBgColor,
                        48,
                      );
                      return (
                        <button
                          key={shape.id}
                          type="button"
                          onClick={() => handleSelectShape(shape)}
                          className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all hover:border-primary ${
                            selectedShape.id === shape.id
                              ? "border-primary bg-primary/10"
                              : "border-border bg-card/50"
                          }`}
                          title={shape.name}
                        >
                          <div
                            className="w-12 h-12"
                            // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted SVG generated internally
                            dangerouslySetInnerHTML={{ __html: miniSVG }}
                          />
                          <span className="text-xs text-muted-foreground truncate w-full text-center">
                            {shape.name}
                          </span>
                        </button>
                      );
                    },
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Preview + Colors */}
        <div className="flex flex-col items-center gap-4 min-w-[220px]">
          <div className="w-48 h-48 rounded-2xl border border-border bg-card/50 flex items-center justify-center overflow-hidden shadow-lg">
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: trusted SVG generated internally */}
            <div dangerouslySetInnerHTML={{ __html: previewSVG }} />
          </div>

          <div className="w-full space-y-3">
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-muted-foreground shrink-0" />
              {/* biome-ignore lint/a11y/noLabelWithoutControl: color input is visually adjacent */}
              <label className="text-sm text-muted-foreground w-24">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => {
                    setFgColor(e.target.value);
                    setSaved(false);
                  }}
                  className="w-10 h-8 rounded cursor-pointer border border-border bg-transparent"
                />
                <span className="text-xs font-mono text-muted-foreground">
                  {fgColor}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-muted-foreground shrink-0" />
              {/* biome-ignore lint/a11y/noLabelWithoutControl: color input is visually adjacent */}
              <label className="text-sm text-muted-foreground w-24">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    setBgColor(e.target.value);
                    setSaved(false);
                  }}
                  className="w-10 h-8 rounded cursor-pointer border border-border bg-transparent"
                />
                <span className="text-xs font-mono text-muted-foreground">
                  {bgColor}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full"
            variant={saved ? "secondary" : "default"}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-2" /> Saved!
              </>
            ) : (
              "Save as Avatar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
