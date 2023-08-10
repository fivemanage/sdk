Logs = {}
local apiUrl= "https://api.fivemanage.com/logs"
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
	print("LogMessage: " .. info .. " " .. message)

    local log_data = {
        info = info,
        message = message,
        -- TODO: We might not actually have to do this at all. One seralization might be enough
        metadata = json.encode(metadata)
    }

	sendHttpRequest(log_data)
end

print("LOGS ARE CURRENTLY IN BETA. IF YOU'D LIKE TO TEST, PLEASE JOIN OUR DISCORD SERVER")
