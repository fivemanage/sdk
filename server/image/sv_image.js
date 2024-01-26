import FormData from "form-data";
import fetch from "node-fetch";

const API_URL = "https://api.fivemanage.com/api/image";

exports("takeServerImage", async (src, metadata) => {
  if (!src) throw new Error("Player Id provided is not valid");

  return await new Promise((resolve) => {
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

onNet("fivemanage:takeImage", (metadata, requestId) => {
  const src = globalThis.source;

  exports["screenshot-basic"].requestClientScreenshot(
    src,
    {
      encoding: "png",
      quality: 0.85,
    },
    (_, data) => {
      uploadImage(data, metadata).then((result) => {
        emitNet("fivemanage:receiveImageCallback:" + requestId, src, result);
        setTimeout(() => {
          emitNet("fivemanage:receiveImageCallback:" + requestId, src, result);
        }, 1000);
      });
    }
  );
});

function uploadImage(data, metadata) {
  const apiKey = GetConvar("FIVEMANAGE_MEDIA_API_KEY", "");

  if (!apiKey) {
    console.error("FIVEMANAGE_MEDIA_API_KEY is not set");
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
        Authorization: apiKey,
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
