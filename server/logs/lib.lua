Logs = {}
local apiUrl = "https://api.fivemanage.com/logs"
local apiKey = GetConvar("FIVEMANAGE_API_KEY", "")


-- TODO: Add context to logs
function Logs.findContext()
	local info = debug.getinfo(2, "n")

    return info
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

function Logs:LogMessage(info, message, metadata)
	--self.findContext()
    local log_data = {
        info = info,
        message = message,
        metadata = json.encode(metadata)
    }

    -- might have to look into some batching later, in order to reduce the amount of requests sent to the backend
    -- for testing though, this should be fine
	sendHttpRequest(log_data)
end

function GetLoggerInstance() {
    return Logs
}

print("LOGS ARE CURRENTLY IN BETA. IF YOU'D LIKE TO TEST, PLEASE JOIN OUR DISCORD SERVER")