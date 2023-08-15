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

## Note

Only users with beta access can use logs right now. We'll update our discord and this readme when it is available for everyone! Hang in there!

- info
- warn
- error

### Client

Coming soon

### Server

```lua
exports.fivemanage_lib:LogMessage("error", "Failed to roleplay")

-- With metadata
exports.fivemanage_lib:LogMessage("error", "Failed to roleplay", {
    playerName = "Dude",
    playerIdentifier = someFunctionThatReturnsTheID(someArg)
})
```
