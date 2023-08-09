Logs = {}
Logs.apiUrl= "https://api.fivemanagee.com/logs"
Logs.apiKey = ""

function Logs:start()
    Logs.apiKey = GetConvar("FIVEMANAGE_API_KEY", "")
end

-- TODO: Add context to logs
function Logs.findContext()
	local info = debug.getinfo(2, "n")

    return info
end

function Logs:sendHttpRequest(data)
	PerformHttpRequest(
        self.apiUrl,
        function() end,
        "POST", 
        data = json.encode(data),
        {
            Authorization = self.apiKey
        }
    )
end

function Logs:LogMessage(info, message, metadata)
	self.findContext()
	print("LogMessage: " .. info .. " " .. message)

    local log_data = {
        info = info,
        message = message,
        -- TODO: We might not actually have to do this at all. One seralization might be enough
        metadata = json.encode(metadata)
    }

	self:sendHttpRequest(log_data)
end

function Logs:LogInfo(message, metadata)
	self.findContext()
	print("LogMessage: " .. info .. " " .. message)

    local log_data = {
        level = "info",
        message = message,
        -- TODO: We might not actually have to do this at all. One seralization might be enough
        metadata = json.encode(metadata)
    }

	self:sendHttpRequest(log_data)
end

function Logs:LogWarn(message, metadata)
	self.findContext()

    local log_data = {
        level = "warn",
        message = message,
        -- TODO: We might not actually have to do this at all. One seralization might be enough
        metadata = json.encode(metadata)
    }

	self:sendHttpRequest(log_data)
end

function Logs:LogError(message, metadata)
	self.findContext()

    local log_data = {
        level= "error",
        message = message,
        -- TODO: We might not actually have to do this at all. One seralization might be enough
        metadata = json.encode(metadata)
    }

	self:sendHttpRequest(log_data)
end

-- TODO: Add fatal level log

Logs:start()

print("LOGS ARE CURRENTLY IN BETA. IF YOU'D LIKE TO TEST, PLEASE JOIN OUR DISCORD SERVER")
