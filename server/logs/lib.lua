Logs = {}
local apiUrl = "https://api.fivemanage.com/logs"
local apiKey = GetConvar("FIVEMANAGE_API_KEY", "")


-- TODO: Add context to logs
function Logs.findContext()
	local info = debug.getinfo(2, "n")

    return info
end

local function isValidLogLevel(level)
    if level == "info" or "warn" or "error" then
        return true
    end

    return false
end

local function sendHttpRequest(data)
	PerformHttpRequest(
        apiUrl,
        function() end,
        "POST",
        data = json.encode(data),
        {
            Authorization = apiKey
        }
    )
end

function Logs:LogMessage(level, message, metadata)
    local isValid = isValidLogLevel(level)
    if !isValid then
        print("Log level is not valid. Use 'info', 'warn' or 'error'.")
        return
    end

	--self.findContext()
    local log_data = {
        level = level,
        message = message,
        metadata = json.encode(metadata)
    }

    -- might have to look into some batching later, in order to reduce the amount of requests sent to the backend
    -- for testing though, this should be fine
	sendHttpRequest(log_data)
end

function GetLoggerInstance()
    return Logs
end

print("LOGS ARE CURRENTLY IN BETA. IF YOU'D LIKE TO TEST, PLEASE JOIN OUR DISCORD SERVER")

