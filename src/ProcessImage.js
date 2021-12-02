import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api_url, api_token } from "./keep";

import axios from "axios";

function ProcessImage() {
  let navigate = useNavigate();
  let [output, setOutput] = useState("");
  let [postImg, setPostImg] = useState("");
  // let [imgUrl, setImgUrl] = useState("");
  let [formMsgBool, setFormMsgBool] = useState(false);
  let [formMsg, setFormMsg] = useState("");

  useEffect(() => {
    checkLog();
  });

  const checkLog = async () => {
    var mjk_email = localStorage.getItem("mjk_email");
    var mjk_token = localStorage.getItem("mjk_token");
    if (
      mjk_email === "" ||
      mjk_token === "" ||
      mjk_email === null ||
      mjk_token === null
    ) {
      navigate("/");
      // setIsLogged(false);
    }

    try {
      var response = await axios.post(
        `${api_url}users/single?api_token=${api_token}`,
        {
          email: mjk_email,
          token: mjk_token,
        }
      );

      if (response.data.status) {
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      navigate("/");
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const resizeImage = (settings) => {
    var file = settings.file;
    var reader = new FileReader();
    var image = new Image();
    var canvas = document.createElement("canvas");
    var dataURItoBlob = function (dataURI) {
      var bytes =
        dataURI.split(",")[0].indexOf("base64") >= 0
          ? atob(dataURI.split(",")[1])
          : unescape(dataURI.split(",")[1]);
      var mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
      var max = bytes.length;
      var ia = new Uint8Array(max);
      for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
      return new Blob([ia], { type: mime });
    };

    var resize = function () {
      let imgW;
      let imgH;
      if (settings.type === 1) {
        imgW = image.width;
        imgH = image.height;

        canvas.width = image.width;
        canvas.height = image.height;
      } else if (settings.type === 2) {
        if (image.width !== image.height) {
          if (image.width > image.height) {
            imgW = image.width;
            imgH = image.width;
          }
          else{
            imgW = image.height;
            imgH = image.heights;
          }
        } else {
          imgW = image.width;
          imgH = image.height;
        }

        canvas.width = imgW;
        canvas.height = imgH;
      } else if (settings.type === 3) {
        imgW = 250;
        imgH = 250;

        canvas.width = 250;
        canvas.height = 250;
      } else {
        imgW = image.width;
        imgH = image.height;

        canvas.width = image.width;
        canvas.height = image.height;
      }

      var ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(image, 0, 0, imgW, imgH);

      var dataUrl = canvas.toDataURL("image/jpeg");
      return dataURItoBlob(dataUrl);
    };
    return new Promise(function (resolve, reject) {
      if (!file.type.match(/image.*/)) {
        reject(new Error("Not an image"));
        return;
      }
      reader.onload = function (readerEvent) {
        image.onload = function () {
          return resolve(resize());
        };
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setPostImg(file);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (postImg === "") {
      setFormMsgBool(true);
      setFormMsg("No Picture Uploaded");
      return;
    }

    if (output === "") {
      setFormMsgBool(true);
      setFormMsg("Select the Output");
      return;
    }

    setFormMsgBool(false);

    const resizedImage1 = await resizeImage({ file: postImg, type: 1 });
    const resizedImage2 = await resizeImage({ file: postImg, type: 2 });
    const resizedImage3 = await resizeImage({ file: postImg, type: 3 });

    try {
      var base641 = await convertToBase64(resizedImage1);
      var base642 = await convertToBase64(resizedImage2);
      var base643 = await convertToBase64(resizedImage3);

      // console.log(resizedImage2);

      var response = await axios.post(
        `${api_url}users/save_picture?api_token=${api_token}`,
        {
          output: output,
          picture1: base641,
          picture2: base642,
          picture3: base643,
        }
      );

      if (response.data.status) {
        setFormMsgBool(true);
        setFormMsg(response.data.data);
        return;
      } else {
        setFormMsgBool(true);
        setFormMsg(response.data.data);
        return;
      }
      // setImgUrl(base641);
    } catch (err) {
      console.log(err);
    }
  };

  let fm;
  if (formMsgBool) {
    fm = <p style={{ color: "red" }}>{formMsg}</p>;
  } else {
    fm = "";
  }

  return (
    <div className="row mt-5">
      <div className="col-md-4">
        <div className="card">
          <div className="card-body row">
            <div className="col-md-12">
              <h5 className="card-title">Process Image</h5>
              <form>
                {fm}
                <div className="form-group">
                  <label>Select Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".jpeg, .png, .jpg"
                    onChange={(e) => handleFileUpload(e)}
                  />
                </div>
                <div className="form-group">
                  {/* <img src={imgUrl} alt="" /> */}
                </div>

                <div className="form-group">
                  <label>Select Output</label>
                  <select
                    className="form-control"
                    onChange={(e) => setOutput(e.target.value)}
                  >
                    <option value=""></option>
                    <option value="1">Original</option>
                    <option value="2">Square of original size </option>
                    <option value="3">Small (256px x 256px)</option>
                    <option value="4">All Three</option>
                  </select>
                </div>

                <div className="form-group">
                  <button
                    className="btn btn-success"
                    onClick={(e) => submitForm(e)}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProcessImage;
