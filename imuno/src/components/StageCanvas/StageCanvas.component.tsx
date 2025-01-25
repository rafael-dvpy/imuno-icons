import React, { useEffect, useRef } from "react";
import { Stage } from "konva/lib/Stage";
import {  Layer } from "konva/lib/Layer";
import Konva from "konva";

// Props for the StageCanvas component
interface StageCanvasProps {
  width: number;
  height: number;
  onShapeClick: (shapeId: string) => void;
}

const StageCanvas: React.FC<StageCanvasProps> = ({
  width,
  height,
  onShapeClick,
}) => {
  const stageRef = useRef<Stage | null>(null);
  const layerRef = useRef<Layer | null>(null);

  useEffect(() => {
    if (stageRef.current && layerRef.current) {
      // Initializing stage and layer if needed
      stageRef.current.add(layerRef.current);
    }
  }, []);

  // Example function to handle shape clicks
  const handleShapeClick = (event: Konva.KonvaEventObject<MouseEvent>) => {
    const shapeId = event.target.id();
    onShapeClick(shapeId);
  };

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
import React, { useEffect, useRef } from "react";
import { Stage as KonvaStage, Layer as KonvaLayer } from "konva";
import { Stage, Layer } from "react-konva";

// Props for the StageCanvas component
interface StageCanvasProps {
  width: number;
  height: number;
  onShapeClick: (shapeId: string) => void;
}

const StageCanvas: React.FC<StageCanvasProps> = ({ width, height, onShapeClick }) => {
  const stageRef = useRef<KonvaStage | null>(null);
  const layerRef = useRef<KonvaLayer | null>(null);

  useEffect(() => {
    if (stageRef.current && layerRef.current) {
      // Initializing stage and layer if needed
      stageRef.current.add(layerRef.current);
    }
  }, []);

  // Example function to handle shape clicks
  const handleShapeClick = (event: Konva.KonvaEventObject<MouseEvent>) => {
    const shapeId = event.target.id();
    onShapeClick(shapeId);
  };

  return (
    <Stage
      width={width}
      height={height}
      ref={stageRef}
      onClick={handleShapeClick}
    >
      <Layer ref={layerRef}>
        {/* Add your shapes here */}
      </Layer>
    </Stage>
  );
};

export default StageCanvas;
