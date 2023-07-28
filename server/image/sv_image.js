import FormData from "form-data";
import fetch from "node-fetch";

const API_URL = "https://api.fivemanage.com/api/image";

exports("takeServerImage", async (src, metadata) => {
  if (!src) throw new Error("Player Id provided is not valid");

  return await new Promise((resolve, reject) => {
    exports["screenshot-basic"].requestClientScreenshot(
      src,
      {
        encoding: "png",
        quality: 0.85,
      },
      (_, data) => {
        uploadImage(data, metadata).then((res) => {
          resolve(res);
        });
      }
    );
  });
});

onNet("fivemanage:server:takeImage", (metadata, requestId) => {
  const src = global.source;

  exports["screenshot-basic"].requestClientScreenshot(
    src,
    {
      encoding: "png",
      quality: 0.85,
    },
    (_, data) => {
      uploadImage(data, metadata).then((result) => {
        emitNet(
          "fivemanage:client:receiveImageCallback:" + requestId,
          src,
          result
        );
        setTimeout(() => {
          emitNet(
            "fivemanage:client:receiveImageCallback:" + requestId,
            src,
            result
          );
        }, 1000);
      });
    }
  );
});

function uploadImage(data, metadata) {
  const apiToken = GetConvar("FIVEMANAGE_IMAGE_TOKEN", "");

  if (!apiToken) {
    console.error("FIVEMANAGE_IMAGE_TOKEN is not set");
    return;
  }

  const buf = Buffer.from(data.split(",")[1], "base64");

  const form = new FormData();
  form.append("image", buf, "image.png");

  if (metadata) {
    form.append("metadata", JSON.stringify(metadata));
  }

  return new Promise((resolve, reject) => {
    fetch(API_URL, {
      method: "POST",
      body: form,
      headers: {
        Authorization: apiToken,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        resolve(json);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}
