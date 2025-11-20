import React, { useEffect, useRef } from 'react';
import { TransformControls, OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

export default function TransformControlsWrapper({ objectRef, mode='translate', enabled=true, onChange, onDragStart, onDragEnd }) {
  const tcRef = useRef();
  const gl = useThree(state => state.gl);
  const camera = useThree(state => state.camera);
  const controls = useRef();

  useEffect(() => {
    if (!tcRef.current) return;
    const tc = tcRef.current;
    const handler = (e) => {
      onChange && onChange(e);
    };
    tc.addEventListener('objectChange', handler);
    tc.addEventListener('mouseDown', onDragStart);
    tc.addEventListener('mouseUp', onDragEnd);
    return () => {
      tc.removeEventListener('objectChange', handler);
      tc.removeEventListener('mouseDown', onDragStart);
      tc.removeEventListener('mouseUp', onDragEnd);
    };
  }, [onChange, onDragStart, onDragEnd]);

  return <>
    <TransformControls ref={tcRef} camera={camera} domElement={gl.domElement} mode={mode} enabled={enabled} />
    <OrbitControls ref={controls} />
  </>;
}
