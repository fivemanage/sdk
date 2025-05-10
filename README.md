# **Fivemanage SDK for FiveM**

This sdk simplifies interaction with our public API for FiveM server developers, providing straightforward access to image, video, audio, and log hosting services.

## **Table of Contents**

- **[Dependencies](#resource-dependencies)**
- **[Installation & Setup](#installation--setup)**
- **[Working with Images](#working-with-images)**
- **[Working with Logs](#working-with-logs)**
- **[Community & Support](#community--support)**

## **Resource Dependencies**

**[screenshot-basic](https://github.com/citizenfx/screenshot-basic)**: A required resource to enable the sdk to capture client screen images.

## **Installation & Setup**

1. **Download the SDK:** Obtain the latest release of the Fivemanage SDK from the **[release page](https://github.com/fivemanage/sdk/releases/latest)**. Ensure you download the `fmsdk.zip` file. It's recommended to download this release instead of cloning the repository unless you intend to build the project yourself.

2. **Extract to Resources:** Unzip and place the `fmsdk` folder into your FiveM server's `resources` folder.

3. **Setup Dependencies:** If not already present, download and set up `screenshot-basic` by following its **[installation instructions](https://github.com/citizenfx/screenshot-basic?tab=readme-ov-file#usage)**. This resource is essential for capturing client screen images.

4. **Configure Server CFG:**

   - Make sure `screenshot-basic` is started before `fmsdk` in your `server.cfg`. Add the following lines:
     ```
     ensure screenshot-basic  # Only add this line if `screenshot-basic` is not already ensured in your configuration.
     ensure fmsdk    # The SDK must be started after the `screenshot-basic` resource.
     ```
   - Add the following ConVars to your `server.cfg` for API authentication depending on what you're using the sdk for. Both are not required at the same time.
     ```
     set FIVEMANAGE_MEDIA_API_KEY your_api_key
     set FIVEMANAGE_LOGS_API_KEY your_api_key
     ```
     Learn more about ConVars in the **[FiveM documentation](https://docs.fivem.net/docs/scripting-reference/convars/)**.

5. **Resource Config:** Review and adjust the settings in `config.json` to match your preferences and requirements. This file contains important configuration options that affect how the SDK operates on your server.

6. **Success:** With the SDK properly installed, you're ready to use its functionality in your server. You can now call events or exports provided by the Fivemanage SDK as detailed below.

## **Working with Images**

This section provides examples of how to use the `takeImage` and `takeServerImage` exports on the client and server sides, respectively.

Examples are provided in both Lua and JavaScript. TypeScript developers can refer to the type annotations provided in the function definitions for guidance on the expected argument and return types.

### **Client Exports**

**Function Definition:**

```typescript
takeImage(metadata?: Record<string, unknown>): Promise<{ url: string }>
```

**Lua Example:**

```lua
local imageData = exports.fmsdk:takeImage()

-- With metadata
local imageData = exports.fmsdk:takeImage({
    name = "My image",
    description = "This is my image",
    -- or any other field you want
})

print(imageData.url)
```

**JavaScript Example:**

```javascript
exports.fmsdk.takeImage().then((imageData) => {
  console.log(imageData.url);
});

// With metadata
exports.fmsdk
  .takeImage({
    name: "My image",
    description: "This is my image",
    // or any other field you want
  })
  .then((imageData) => {
    console.log(imageData.url);
  });
```

### **Server Exports**

**Function Definition:**

```typescript
takeServerImage(playerSource: string | number, metadata?: Record<string, unknown>, timeout?: number): Promise<{ url: string }>
```

**Lua Example:**

```lua
local imageData = exports.fmsdk:takeServerImage(playerSource)

-- With metadata
local imageData = exports.fmsdk:takeServerImage(playerSource, {
    name = "My image",
    description = "This is my image",
    -- or any other field you want
})

print(imageData.url)


-- With metadata and timeout support.
local success, imageData = pcall(function()
    return exports.fmsdk:takeServerImage(source, {
        name = 'My image',
        description = 'This is my image',
    }, 10000)
end)

if success then
    print(imageData.url)
else
    error('we are unable to capture screenshot to player.')
end
```

**JavaScript Example:**

```javascript
exports.fmsdk.takeServerImage(playerSource).then((imageData) => {
  console.log(imageData.url);
});

// With metadata
exports.fmsdk
  .takeServerImage(playerSource, {
    name: "My image",
    description: "This is my image",
    // or any other field you want
  })
  .then((imageData) => {
    console.log(imageData.url);
  });
```

## **Working with Logs**

This section provides examples of how to use the `LogMessage` export on the server. It also includes explanations of the various settings within `config.json`, detailing how each can be configured to customize logging functionality.

Examples are provided in both Lua and JavaScript. TypeScript developers can refer to the type annotations provided in the function definitions for guidance on the expected argument and return types.

### **Config Settings:**

- **"level"**: Sets the minimum log level to capture. "info" by default, meaning only logs of "info" level and above are recorded. **This value must be one of the options defined in the "levels" array**.

- **"levels"**: Defines the hierarchy of log levels from most to least critical. Only levels included in this array can be used during runtime.

- **"console"**: Enables or disables logging to the server console. Set to `true` to activate console logging.

- **"enableCloudLogging"**: Determines whether logs should be sent to the Fivemanage cloud. Set to `false` to keep logs local or `true` to enable cloud logging.

- **"appendPlayerIdentifiers"**: When `true`, player identifiers are automatically appended to the log's metadata if `metadata.playerSource` and/or `metadata.targetSource` are specified.

- **"excludedPlayerIdentifiers"**: A list of identifier types that will be excluded from appended identifier metadata.

- **"playerEvents"**: Enable player events like connecting and dropped.

- **"chatEvents"**: Enable chat events. (this might cause a lot of logs)
- **"txAdminEvents"**: Enable txAdmin events.


### Datsets
The first argumment of `fmsdk:Log` is the dataset you wish to ingest logs to. This is simply the name of the dataset, as you named it in the Fivemanage dashboard.

### **Server Exports**

**Function Definition:**

```typescript
Log(datasetId: string, level: string, message: string, metadata?: { playerSource?: string | number, targetSource?: string | number, [key: string]: unknown }): void
```

**Lua Example:**

```lua
exports.fmsdk:Log("default", "info", "Player connected", {
    playerSource = source,
    customData = "Additional info"
})

-- Without metadata
exports.fmsdk:Log("default", "error", "An error occurred")
```

**JavaScript Example:**

```javascript
exports.fmsdk.Log("default", "info", "Player connected", {
  playerSource: player.id,
  customData: "Additional info"
});

// Without metadata
exports.fmsdk.Log("default", "error", "An error occurred");
```

You can also use a couple shorthands, if you don't wish to set the level all the time.

```typescript
Info(datasetId: string, message: string, metadata?: { playerSource?: string | number, targetSource?: string | number, [key: string]: unknown }): void

Error(datasetId: string, message: string, metadata?: { playerSource?: string | number, targetSource?: string | number, [key: string]: unknown }): void

Warn(datasetId: string, message: string, metadata?: { playerSource?: string | number, targetSource?: string | number, [key: string]: unknown }): void
```

```lua
exports.fmsdk:Info()
exports.fmsdk:Error()
export.fmsdk:Warn()
```

**Dataset example**:'
The first argument is alwasy the datasetId, otherwise known a the `name` of the dataset.

This log would go to the dataset which is called `bank`. 
```lua
exports.fmsdk:Log("bank", "info", "Someone transferred money")
```

And this, would go to your `default` dataset.
```lua
exports.fmsdk:Log("default", "info", "Someone happened on the server.")
```

If you keep using the export: `fmsdk:LogMessage`, all logs will go the `default` dataset.

## Community & Support

Join our community on [Discord](https://discord.gg/NCsp2ZB3Ye)! It's the perfect place to ask questions, provide feedback, and connect with other users and the development team. If you need direct support or have specific inquiries, feel free to open a support ticket in our Discord server. 

We're here to help and look forward to your contributions and discussions.