import { useEffect, useState } from 'react';
import Konva from 'konva';
import { Stage } from 'konva/lib/Stage';
import { Layer } from 'konva/lib/Layer';

const shapes = [
  { id: 'virus', url: '../files/virus.svg' },
  { id: 'anticorpo', url: '../files/icion_anticorpo.svg' },
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

  const addBG = () => {
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

  addBG()


  const addArrow = () => {
    if (stage) {
      const remove = () => {
        stage.off('mousedown')
        stage.off('mouseup')
      }
      let startX: number, startY: number, endX, endY;
      stage.on('mousedown', (e) => {
        startX = e.evt.offsetX;
        startY = e.evt.offsetY;
      });

      stage.on('mouseup', (e) => {
        endX = e.evt.offsetX;
        endY = e.evt.offsetY;

        const arrow = new Konva.Arrow({
          x: 0,
          y: 0,
          points: [startX, startY, endX, endY],
          pointerLength: 20,
          pointerWidth: 20,
          fill: 'black',
          stroke: 'black',
          strokeWidth: 4,
          draggable: true,
        });
        addTransformer(arrow);
        layer.add(arrow);
        layer.draw();
        remove()
      });
    }
  }


  const addRectWithText = (content: string) => {
    if (stage) {
      const remove = () => {
        stage.off('mousedown')
        stage.off('mouseup')
      }
      let x: number, y: number
      stage.on('mousedown', (e) => {
        x = e.evt.offsetX;
        y = e.evt.offsetY;
      });

      stage.on('mouseup', () => {
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
          fill: 'lightblue',
        });
        const text = new Konva.Text({
          x: x,
          y: y,
          text: content,
          align: "center",
          verticalAlign: "center",
          padding: 34,
          fontSize: 16,
          width: 200,
          height: 100,
          fontFamily: 'Arial',
          fill: 'black',
        });
        group.add(rect);
        group.add(text);
        addTransformer(group);
        layer.add(group);
        layer.draw();
        remove()
      })
    }
  };

  const [textContent, setTextContent] = useState("")

  const handleTextChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setTextContent(e.currentTarget.value)
  }

  return (
    <div className="flex h-screen">
      <div className="bg-gray-800 flex flex-col items-center py-8">
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
          id="save-btn"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => handleSaveClick()}
        >
          Save
        </button>
        <button
          id="add-circle-btn"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
          onClick={() => addArrow()}
        >
          Add Arrow
        </button>
        <button
          id="add-circle-btn"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
          onClick={() => addRectWithText(textContent)}
        >
          Add Text
        </button>
        <textarea onChange={(e) => handleTextChange(e)} />
      </div>
      <div className="bg-gray-400" id="stage-container">
        <div className='w-screen bg-gray-400 content-center h-screen flex justify-center items-center'>
          <div id="stage" className='' onClick={handleStageClick}></div>
        </div>
      </div>
    </div >
  );
}

export default App;
