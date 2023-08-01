# Fivemanage API SDK for FiveM

This is the official Fivemanage API SDK for FiveM. It is written in Javascript
and Lua.

## Requirements

- Screenshot Basic

## Installation

Download the latest release from the
[releases](https://github.com/fivemanage/sdk/releases). Make sure it is the
`fivemanage_lib.zip ` file.

## Usage

Add the following to your `server.cfg`:

```
set FIVEMANAGE_API_KEY your_api_key
```

This is the key for authenticating with our backend.

You can now call events or exports.

### Client Exports

```lua
local imageData = exports.fivemanage_lib:takeImage()

-- With metadata

local imageData =  exports.fivemanage_lib:takeImage({
    name = "My image",
    description = "This is my image",
    -- or any other field you want
})

print(image.url)
```

### Server Exports

```lua
local imageData = exports.fivemanage_lib:takeServerImage(src)

-- With metadata

local imageData = exports.fivemanage_lib:takeServerImage(src, {
    name = "My image",
    description = "This is my image",
    -- or any other field you want
})

print(image.url)
```
