// src/components/StageCanvas/StageCanvas.component.tsx
import React, { useEffect, useState } from "react";
import Konva from "konva";
import { Layer, Stage } from "konva/lib/Stage";
import { Stage as KonvaStage } from "konva";

interface StageCanvasProps {
  selectedShape: string;
  onShapeAdded: (x: number, y: number, shapeUrl: string) => void;
  onShapeClick: (shapeId: string) => void;
}

const StageCanvas: React.FC<StageCanvasProps> = ({
  selectedShape,
  onShapeAdded,
  onShapeClick,
}) => {
  const [stage, setStage] = useState<KonvaStage>();
  const [layer, setLayer] = useState<Layer>(new Konva.Layer());

  useEffect(() => {
    const konvaStage = new Konva.Stage({
      container: "stage",
      width: 800 - 100,
      height: 600,
    });
    const konvaLayer = new Konva.Layer();
    konvaStage.add(konvaLayer);
    setStage(konvaStage);
    setLayer(konvaLayer);
  }, []);

  const handleStageClick = () => {
    if (selectedShape) {
      const position = stage?.getPointerPosition();
      if (position) {
        const selectedSvg = { url: `/files/${selectedShape}.svg` }; // Fetch URL for selected shape
        onShapeAdded(position.x, position.y, selectedSvg.url);
      }
    }
  };

  return (
    <div id="stage" className="w-full h-full" onClick={handleStageClick}></div>
  );
};

export default StageCanvas;
