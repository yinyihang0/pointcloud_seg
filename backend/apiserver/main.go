package main

import (
    "net/http"
	"log"
	"fmt"
	"io"
	"os"
    "os/exec"
)

func callPythonScript(filePath string) error {
    cmd := exec.Command("python3", "../scripts/visual_and_output.py", "--input_model", filePath)
    err := cmd.Run()
    return err
}

func main() {
	http.HandleFunc("/upload", func(w http.ResponseWriter, r *http.Request) {
		// 确保是 POST 请求
		if r.Method != "POST" {
			http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
			return
		}

		// 解析上传的文件
		file, header, err := r.FormFile("file")
		if err != nil {
			http.Error(w, "Error retrieving the file", http.StatusBadRequest)
			return
		}
		defer file.Close()

		filePath := "../data/uploaded/" + header.Filename
		dst, err := os.Create(filePath)
		if err != nil {
			http.Error(w, "Error saving file", http.StatusInternalServerError)
			return
		}
		defer dst.Close()

		_, err = io.Copy(dst, file)
		if err != nil {
			http.Error(w, "Error saving file", http.StatusInternalServerError)
			return
		}

		err = callPythonScript(filePath)
		if err != nil {
			log.Printf("Error calling Python script: %v", err)
			http.Error(w, "Error processing file", http.StatusInternalServerError)
			return
		}
		
		// http.serverFile(w, r, "../data/vis_model.zip")
		// fmt.Fprintf(w, "File uploaded successfully: %v", header.Filename)
		fmt.Fprintf(w, "File processed successfully. Download at /download/%s", "../data/vis_model.zip")
	})
	http.HandleFunc("/download", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")

		http.ServeFile(w, r, "../data/vis_model.zip")
	})

	log.Println("Starting server on :8080")
	err := http.ListenAndServe(":8080", nil)
    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }

}
