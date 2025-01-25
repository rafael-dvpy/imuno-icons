import React from 'react';

type TopBarProps = {
  onSaveClick: () => void;
  onAddArrow: () => void;
  onAddText: () => void;
  onUndo: () => void; // Undo function prop
  onRedo: () => void; // Redo function prop
};

const TopBar: React.FC<TopBarProps> = ({
  onSaveClick,
  onAddArrow,
  onAddText,
  onUndo,
  onRedo,
}) => {
  return (
    <div className="bg-gray-800 text-white flex justify-between items-center px-4 py-2">
      {/* Left side - Buttons for actions */}
      <div className="flex space-x-4">
        <button
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          onClick={onAddArrow}
        >
          Add Arrow
        </button>
        <button
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          onClick={onAddText}
        >
          Add Text
        </button>
        <button
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          onClick={onSaveClick}
        >
          Save
        </button>
      </div>

      {/* Right side - Undo/Redo buttons */}
      <div className="flex space-x-4">
        <button
          className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
          onClick={onUndo}
        >
          Undo
        </button>
        <button
          className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
          onClick={onRedo}
        >
          Redo
        </button>
      </div>
    </div>
  );
};

export default TopBar;
