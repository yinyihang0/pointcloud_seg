// components/UploadForm.tsx


const UploadForm = () => {
  return (
    <form action="http://localhost:8080/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="file" accept=".zip" />
      <button type="submit">Upload File</button>
    </form>
  );
};

export default UploadForm;
