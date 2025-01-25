import { useEffect, useState } from "react";
import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { Layer } from "konva/lib/Layer";
import SideBar from "./components/SideBar/SideBar.component";
import TopBar from "./components/TopBar/TopBar.component"; // Import the TopBar

const shapes = [
  { id: "virus", url: "/files/virus.svg" },
  { id: "anticorpo", url: "/files/icion_anticorpo.svg" },
  { id: "cell-t", url: "/files/cell-t.svg" },
  { id: "antigen", url: "/files/antigen.svg" },
  { id: "dend-cell", url: "/files/dend-cell.svg" },
  { id: "mch-2", url: "/files/mch-2.svg" },
  { id: "t-receptor", url: "/files/t-receptor.svg" },
];

function App() {
  const [stage, setStage] = useState<Stage>();
  const [layer, setLayer] = useState<Layer>(new Konva.Layer());
  const [bgLayer, setBgLayer] = useState<Layer>(new Konva.Layer());
  const [selectedShape, setSelectedShape] = useState<string>();
  const [textContent, setTextContent] = useState<string>("");

  // History stack for undo/redo
  const [history, setHistory] = useState<any[]>([]); // Stack of history states
  const [historyPointer, setHistoryPointer] = useState<number>(-1); // Points to the current position in history

  useEffect(() => {
    const konvaStage = new Konva.Stage({
      container: "stage",
      width: 800 - 100,
      height: 600,
    });
    const konvaLayer = new Konva.Layer();
    const konvaBgLayer = new Konva.Layer();
    konvaStage.add(konvaBgLayer);
    konvaStage.add(konvaLayer);
    setStage(konvaStage);
    setLayer(konvaLayer);
    setBgLayer(konvaBgLayer);
    addBG(); // Initialize the background
  }, []);

  // Helper function to add actions to history
  const addHistory = (action: string, data: any) => {
    const newHistory = history.slice(0, historyPointer + 1); // Remove any future actions after historyPointer
    newHistory.push({ action, data });
    setHistory(newHistory);
    setHistoryPointer(newHistory.length - 1); // Move pointer to the new action
  };

  // Undo functionality
  const undo = () => {
    if (historyPointer >= 0) {
      const previousAction = history[historyPointer];
      if (previousAction.action === "add") {
        // Undo add by removing the shape
        previousAction.data.destroy();
        layer.draw();
      }
      // Move pointer back
      setHistoryPointer(historyPointer - 1);
    }
  };

  // Redo functionality
  const redo = () => {
    if (historyPointer < history.length - 1) {
      const nextAction = history[historyPointer + 1];
      if (nextAction.action === "add") {
        // Redo add by adding the shape again
        const shape = nextAction.data;
        layer.add(shape);
        layer.draw();
      }
      // Move pointer forward
      setHistoryPointer(historyPointer + 1);
    }
  };

  const addSvg = (x: number, y: number, svg: string) => {
    const image = new window.Image();
    image.onload = () => {
      const konvaImage = new Konva.Image({
        x: x,
        y: y,
        image: image,
        width: 50,
        height: 50,
        draggable: true,
      });
      addTransformer(konvaImage);
      layer.add(konvaImage);
      layer.draw();

      // Add this action to history
      addHistory("add", konvaImage);
    };
    image.src = svg;
  };

  const addTransformer = (node: Konva.Node) => {
    const transformer = new Konva.Transformer();
    layer.add(transformer);
    node.on("click", () => {
      transformer.nodes([node]);
      layer.batchDraw();
    });
    stage?.on("click", (e) => {
      if (e.target === stage) {
        transformer.detach();
        layer.draw();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        transformer.detach();
        layer.draw();
      } else if (e.key === "Delete") {
        const nodes = transformer.nodes();
        for (let i = 0; i < nodes.length; i++) {
          if (node === nodes[i]) {
            node.destroy();
            transformer.destroy();
            addHistory("remove", node); // Track removal for undo
          }
        }
      }
    });
  };

  const handleShapeClick = (shapeId: string) => {
    setSelectedShape(shapeId);
  };

  const handleStageClick = () => {
    if (selectedShape) {
      const position = stage?.getPointerPosition();
      const selectedSvg = shapes.find((shape) => shape.id === selectedShape);
      if (selectedSvg && position) {
        addSvg(position.x, position.y, selectedSvg.url);
        setSelectedShape("");
      }
    }
  };

  const downloadURI = (uri: string, name: string) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addBG = () => {
    const circle = new Konva.Rect({
      x: 0,
      y: 0,
      width: stage?.width(),
      height: stage?.height(),
      fill: "white",
    });
    bgLayer.add(circle);
    bgLayer.batchDraw();
  };

  const handleSaveClick = () => {
    const dataURL = stage?.toDataURL({ pixelRatio: 3 });
    if (dataURL) {
      downloadURI(dataURL, "stage.png");
    }
  };

  const addArrow = () => {
    if (stage) {
      const remove = () => {
        stage.off("mousedown");
        stage.off("mouseup");
      };
      let startX: number, startY: number, endX, endY;
      stage.on("mousedown", (e) => {
        startX = e.evt.offsetX;
        startY = e.evt.offsetY;
      });

      stage.on("mouseup", (e) => {
        endX = e.evt.offsetX;
        endY = e.evt.offsetY;

        const arrow = new Konva.Arrow({
          x: 0,
          y: 0,
          points: [startX, startY, endX, endY],
          pointerLength: 20,
          pointerWidth: 20,
          fill: "black",
          stroke: "black",
          strokeWidth: 4,
          draggable: true,
        });
        addTransformer(arrow);
        layer.add(arrow);
        layer.draw();

        // Add arrow to history
        addHistory("add", arrow);
        remove();
      });
    }
  };

  const addRectWithText = () => {
    if (stage) {
      const remove = () => {
        stage.off("mousedown");
        stage.off("mouseup");
      };
      let x: number, y: number;
      stage.on("mousedown", (e) => {
        x = e.evt.offsetX;
        y = e.evt.offsetY;
      });

      stage.on("mouseup", () => {
        const group = new Konva.Group({
          x: -100,
          y: -50,
          draggable: true,
        });
        const rect = new Konva.Rect({
          x: x,
          y: y,
          width: 200,
          height: 100,
          fill: "lightblue",
        });
        const text = new Konva.Text({
          x: x,
          y: y,
          text: textContent,
          align: "center",
          verticalAlign: "center",
          padding: 34,
          fontSize: 16,
          width: 200,
          height: 100,
          fontFamily: "Arial",
          fill: "black",
        });
        group.add(rect);
        group.add(text);
        addTransformer(group);
        layer.add(group);
        layer.draw();

        // Add to history
        addHistory("add", group);
        remove();
      });
    }
  };

  const handleTextChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setTextContent(e.currentTarget.value);
  };

  return (
    <>
      <div className="flex h-screen w-screen">
        <SideBar onItemClick={setSelectedShape} />

        {/* TopBar - Control area at the top */}
        <TopBar
          onSaveClick={handleSaveClick}
          onAddArrow={addArrow}
          onAddText={addRectWithText}
          onUndo={undo} // Add undo button
          onRedo={redo} // Add redo button
        />

        <div className="bg-gray-400 w-screen" id="stage-container">
          <div className="bg-gray-400 content-center h-screen flex justify-center items-center">
            <div
              id="stage"
              className="bg-white"
              onClick={handleStageClick}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
