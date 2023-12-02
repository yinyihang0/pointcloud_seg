
import { useEffect, useState } from "preact/hooks";
import  View  from './View.tsx';
import JSZip from 'https://cdn.skypack.dev/jszip';

const DownloadAndRenderButton = () => {
    const [plyUrl, setPlyUrl] = useState(null); // 添加状态管理
    const [camUrls, setCamUrls] = useState(null); // 添加状态管理
    const handleDownload = async () => {
        console.log('Downloading...');
        try {
            const response = await fetch('http://localhost:8080/download');

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            const jszip = new JSZip();
            const zip = await jszip.loadAsync(blob);
            const plyBlob = await zip.file('data/vis_model/pointcloud.ply').async('blob');
            const url = URL.createObjectURL(plyBlob);
            setPlyUrl(url); // 更新状态

            const urls = [];
            // unzip the fille under the folder data/vis_model/cams and put the url to camsUrl: string[]
            // const cam_files = jszip.folder('data/vis_model/cams').files(/.*/);
            const cam_files = [];
            zip.folder('data/vis_model/cams').forEach((relativePath, file) => {
                cam_files.push(file);
            });
            for (const cam_file of cam_files) {
                const camBlob = await cam_file.async('blob');
                const camUrl = URL.createObjectURL(camBlob);
                urls.push(camUrl);
            }

            setCamUrls(urls); // 更新状态
            // console.log(urls.slice(0, 10));
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    return (
        <div>
            <button onClick={handleDownload}>Render</button>
            {/* {plyUrl && <PlyViewer objUrl={plyUrl} />} 条件渲染 */}
            {plyUrl && camUrls && <View objUrl={plyUrl} objUrls={camUrls} />}
        </div>
    );
};

export default DownloadAndRenderButton;

