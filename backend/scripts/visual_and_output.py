from visualize_model import Model
import os
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Visualize COLMAP binary or text models"
    )
    parser.add_argument(
        "--input_model", required=True, help="path to input model folder"
    )
   
    args = parser.parse_args()
    # upzip the file from args.input_model to path ../data/3dmodel
    os.system("unzip -o " + args.input_model + " -d ../data/3dmodel")

    # read COLMAP model
    model = Model()
    # file_name = args.input_model.split("/")[-1]
    model.read_model("../data/3dmodel", ext=".bin")

    print("num_cameras:", len(model.cameras))
    print("num_images:", len(model.images))
    print("num_points3D:", len(model.points3D))

    model.export_points()
    model.export_cameras(scale=0.25)

    # zip the file under the path ../data/vis_model
    os.system("zip -r ../data/vis_model.zip ../data/vis_model")