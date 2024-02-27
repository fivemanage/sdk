# **Fivemanage SDK for FiveM**

This sdk simplifies interaction with our public API for FiveM server developers, providing straightforward access to image, video, audio, and log hosting services.

## **Table of Contents**

- **[Dependencies](#resource-dependencies)**
- **[Installation & Setup](#installation--setup)**
- **[Working with Images](#working-with-images)**

## **Resource Dependencies**

**[screenshot-basic](https://github.com/citizenfx/screenshot-basic)**: A required resource to enable the sdk to capture client screen images.

## **Installation & Setup**

1. **Download the SDK:** Obtain the latest release of the Fivemanage SDK from the **[release page](https://github.com/fivemanage/sdk/releases/latest)**. Ensure you download the `fivemanage_sdk.zip` file. It's recommended to download this release instead of cloning the repository unless you intend to build the project yourself.

2. **Extract to Resources:** Unzip and place the `fivemanage_sdk` folder into your FiveM server's `resources` folder.

3. **Setup Dependencies:** If not already present, download and set up `screenshot-basic` by following its **[installation instructions](https://github.com/citizenfx/screenshot-basic?tab=readme-ov-file#usage)**. This resource is essential for capturing client screen images.

4. **Configure Server CFG:**

   - Make sure `screenshot-basic` is started before `fivemanage_sdk` in your `server.cfg`. Add the following lines:
     ```
     ensure screenshot-basic  # Only add this line if `screenshot-basic` is not already ensured in your configuration.
     ensure fivemanage_sdk    # The SDK must be started after the `screenshot-basic` resource.
     ```
   - Add the following ConVars to your `server.cfg` for API authentication:
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
local imageData = exports.fivemanage_sdk:takeImage()

-- With metadata
local imageData = exports.fivemanage_sdk:takeImage({
    name = "My image",
    description = "This is my image",
    -- or any other field you want
})

print(imageData.url)
```

**JavaScript Example:**

```javascript
exports.fivemanage_sdk.takeImage().then((imageData) => {
  console.log(imageData.url);
});

// With metadata
exports.fivemanage_sdk
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
takeServerImage(playerSource: string | number, metadata?: Record<string, unknown>): Promise<{ url: string }>
```

**Lua Example:**

```lua
local imageData = exports.fivemanage_sdk:takeServerImage(playerSource)

-- With metadata
local imageData = exports.fivemanage_sdk:takeServerImage(playerSource, {
    name = "My image",
    description = "This is my image",
    -- or any other field you want
})

print(imageData.url)
```

**JavaScript Example:**

```javascript
exports.fivemanage_sdk.takeServerImage(playerSource).then((imageData) => {
  console.log(imageData.url);
});

// With metadata
exports.fivemanage_sdk
  .takeServerImage(playerSource, {
    name: "My image",
    description: "This is my image",
    // or any other field you want
  })
  .then((imageData) => {
    console.log(imageData.url);
  });
```
