import FormData from 'form-data'
import fetch from 'node-fetch'

const API_URL = "https://api.fivemanage.com/api/image"

exports('takeServerImage', (src, metadata) => {
  exports['screenshot-basic'].requestClientScreenshot(src, {
    encoding: 'png',
    quality: 0.85,
  }, (_, data) => {
    uploadImage(data, metadata)
  })
})

onNet('fivemanage:server:takeImage', (metadata) => {
  const src = global.source;

  console.log("Metadata:", metadata)

  console.log(src)
  exports['screenshot-basic'].requestClientScreenshot(src, {
    encoding: 'png',
    quality: 0.85,
  }, (_, data) => {
    uploadImage(data, metadata)
  })
})

function uploadImage(data, metadata) {
  const buf = Buffer.from(data.split(',')[1], 'base64')

  const form = new FormData()
  form.append('image', buf, 'image.png')

  if (metadata) {
    form.append('metadata', JSON.stringify(metadata))
  }

  fetch(API_URL, {
    method: 'POST',
    body: form,
    headers: {
      'Authorization': ''
    }
  })
  .then(res => res.json())
  .then(json => {
    console.log(json)
  }).catch(err => {
    console.log(err)
  })
}
