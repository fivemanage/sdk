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
set FIVEMANAGE_MEDIA_API_KEY your_api_key
set FIVEMANAGE_LOGS_API_KEY your_api_key
```

This is the key for authenticating with our backend.

You can now call events or exports.

## Images

### Client Exports

```lua
local imageData = exports.fivemanage_lib:takeImage()

-- With metadata

local imageData =  exports.fivemanage_lib:takeImage({
    name = "My image",
    description = "This is my image",
    -- or any other field you want
})

print(imageData.url)
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

print(imageData.url)
```

## Logs

#### Levels

- info
- warn
- error

### Client

Coming soon

### Server

```lua
exports.fivemanage_lib:LogMessage("error", "Failed to roleplay")

-- With metadata
exports.fivemanage_lib:LogMessage('info', "Someone did a bad thing", {
    playerSource = 1, -- All identifiers will be automatically added
    playerName = "John Doe",
    coords = {x = 1, y = 2, z = 3},
    -- or any other field you want
})
```
