import { useEffect, useRef, useState } from "preact/hooks";
import { SceneRenderer } from "../fe/renderer.ts";

type ViewProps = {
  objUrl: string;
  objUrls: string[];
};

const View = ({ objUrl, objUrls }: ViewProps) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sr = new SceneRenderer(container.current!)    
    sr.loadPointCloud(objUrl);
    sr.loadCameras(objUrls);
    sr.clickCams();
    sr.animate();
  }, []);
  return (
    <div ref={container} style={{ width: '100vw', height: '100vh' }}></div>
  );
}
export default View;