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

  exports['screenshot-basic'].requestClientScreenshot(src, {
    encoding: 'png',
    quality: 0.85,
  }, (_, data) => {
    uploadImage(data, metadata)
  })
})

function uploadImage(data, metadata) {
  const apiToken = GetConvar("FIVEMANAGE_IMAGE_TOKEN", '')

  if (!apiToken) {
    console.error("FIVEMANAGE_IMAGE_TOKEN is not set")
    return
  }


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
      'Authorization': apiToken
    }
  })
  .catch(err => {
    console.log(err)
  })
}