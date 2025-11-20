import React, { useState } from 'react';
import Workspace from './scene/Workspace';
import useSceneStore from './store/sceneStore';

export default function App() {
  const [wireframe, setWireframe] = useState(false);
  const undo = useSceneStore(s => s.undo);
  const redo = useSceneStore(s => s.redo);
  const addTube = useSceneStore(s => s.addTube);

  return (
    <div className="app">
      <div className="sidebar">
        <h3>Tube Joints</h3>

        <div className="label">Create Tube</div>
        <div className="prop-row">
          <button className="btn" onClick={() => addTube({ type: 'rect', width: 60, height: 40, thickness: 4, length: 200 })}>
            Add Rect Tube
          </button>
          <button className="btn" onClick={() => addTube({ type: 'square', width: 50, height: 50, thickness: 4, length: 200 })}>
            Add Square Tube
          </button>
        </div>

        <div className="label">View</div>
        <div className="prop-row">
          <label><input type="checkbox" checked={wireframe} onChange={() => setWireframe(!wireframe)} /> Wireframe</label>
        </div>

        <div className="label">Actions</div>
        <div className="controls-row">
          <button className="btn" onClick={undo}>Undo</button>
          <button className="btn" onClick={redo}>Redo</button>
        </div>

        <div style={{marginTop:16}}>
          <strong>Notes</strong>
          <p style={{fontSize:13}}>Drag a tube to move it. Use rotate tool in the scene to rotate. Joint preview appears when a tube is near another.</p>
        </div>
      </div>

      <div className="workspace">
        <Workspace wireframe={wireframe} />
      </div>
    </div>
  );
}
