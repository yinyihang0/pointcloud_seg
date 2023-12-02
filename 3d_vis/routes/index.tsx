import {Handler, PageProps} from '$fresh/server.ts';
import UploadForm from '../components/UploadForm.tsx';
import DownloadAndRenderButton from '../islands/FetchAndRender.tsx';
// add a upload handler


export default function Home({ data }: PageProps) {
  return (
    <div>
      <h1>"Upload a Zip" </h1>
      <UploadForm />
      <h1>"Render" </h1>
      <DownloadAndRenderButton />

    </div>
  );
}

// {/* <div class="p-0 w-full h-full">
//         {/* <MeshViewer objUrl="https://raw.githubusercontent.com/supromikali/react-three-obj-loader/master/public/eleph.obj" /> */}
//         </div> 
//       */}