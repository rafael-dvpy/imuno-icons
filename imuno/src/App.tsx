import { useEffect, useState } from 'react';
import Konva from 'konva';
import { Stage } from 'konva/lib/Stage';
import { Layer } from 'konva/lib/Layer';

const shapes = [
  { id: 'svg1', url: '../files/svg1.svg' },
  { id: 'svg2', url: '../files/svg2.svg' },
  { id: 'svg3', url: '../files/svg3.svg' },
];

function App() {
  const [stage, setStage] = useState<Stage>();
  const [layer, setLayer] = useState<Layer>(new Konva.Layer());
  const [bgLayer, setBgLayer] = useState<Layer>(new Konva.Layer());
  const [selectedShape, setSelectedShape] = useState<string>();

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const konvaStage = new Konva.Stage({
      container: 'stage',
      width: width - 100,
      height: height,
    });
    const konvaLayer = new Konva.Layer();
    const konvaBgLayer = new Konva.Layer();
    konvaStage.add(konvaBgLayer);
    konvaStage.add(konvaLayer);
    setStage(konvaStage);
    setLayer(konvaLayer);
    setBgLayer(konvaBgLayer);
  }, []);

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
    };
    image.src = svg;
  };

  const addTransformer = (node: Konva.Image) => {
    const transformer = new Konva.Transformer();
    layer.add(transformer);
    node.on('click', () => {
      transformer.nodes([node]);
      layer.batchDraw();
    });
    stage?.on('click', (e) => {
      if (e.target === stage) {
        transformer.detach();
        layer.draw();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        transformer.detach();
        layer.draw();
      } else if (e.key === 'Delete') {
        const nodes = transformer.nodes()
        for (let i = 0; i < nodes.length; i++) {
          if (node === nodes[i]) {
            node.destroy();
            transformer.destroy();
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

  function downloadURI(uri: string, name: string) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const addCircle = () => {
    const circle = new Konva.Rect({
      x: 0,
      y: 0,
      width: stage?.width(),
      height: stage?.height(),
      fill: 'white',
    });
    bgLayer.add(circle);
    bgLayer.batchDraw();
  };

  const handleSaveClick = () => {
    var dataURL = stage?.toDataURL({ pixelRatio: 3 });
    if (dataURL) {
      downloadURI(dataURL, "stage.svg")
    }
  }

  addCircle()

  return (
    <div className="flex h-screen">
      <div className="w-1/6 bg-gray-800 flex flex-col items-center py-8">
        <div className="mb-4">
          {shapes.map((shape) => (
            <div
              key={shape.id}
              className="w-10 h-10 bg-gray-600 rounded cursor-pointer mb-2"
              onClick={() => handleShapeClick(shape.id)}
            >
              <img src={shape.url} alt={shape.id} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <button
          id="delete-btn"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
        <button
          id="save-btn"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => handleSaveClick()}
        >
          Save
        </button>
        <button
          id="add-circle-btn"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
          onClick={addCircle}
        >
          Add Circle
        </button>
      </div>
      <div className="flex-1 bg-gray-400" id="stage-container">
        <div id="stage" onClick={handleStageClick}></div>
      </div>
    </div >
  );
}

export default App;
