Logs = {}
local apiUrl = "https://api.fivemanage.com/api/logs"
local apiKey = GetConvar("FIVEMANAGE_API_KEY", "")

-- TODO: Add context to logs
function Logs.findContext()
	local info = debug.getinfo(2, "n")

	return info
end

local function sendHttpRequest(data)
	PerformHttpRequest(apiUrl, function() end, "POST", json.encode(data), {
		["Authorization"] = apiKey,
		["Content-Type"] = "application/json",
	})
end

local function getIdentifiers(playerSource)
	local identifiers = GetPlayerIdentifiers(playerSource)
	local data = {}
	for i = 1, #identifiers do
		--split the identifier at the colon
		local identifier = identifiers[i]
		local _, _, idType, id = string.find(identifier, "([^:]+):(.+)")
		data[idType] = id
	end

	return data
end

---@alias logType string | '"info"' | '"warn"' | '"error"' | 'any' | string

---@class LogOptions
---@field metadata table @The metadata to send with the log. Can be an array or kv.
---@field playerSource number @The player source to send with the log.

---@param logType logType @The log level.
---@param message string @The log message.
---@param options LogOptions @The log options.
function Logs:LogMessage(logType, message, options)
	if not logType == type("string") or not message == type("string") then
		print("Log type or message is missing.")
		return
	end

	if options?.playerSource then
		if not type(options.playerSource) == type("number") then
			print("Player source must be a number.")
			return
		end

		local identifiers = getIdentifiers(options.playerSource)
	end

	local log_data = {
		type = logType,
		message = message,
		options = options
	}

	-- might have to look into some batching later, in order to reduce the amount of requests sent to the backend
	-- for testing though, this should be fine
	sendHttpRequest(log_data)
end

function GetLoggerInstance()
	return Logs
end

print("LOGS ARE CURRENTLY IN BETA. IF YOU'D LIKE TO TEST, PLEASE JOIN OUR DISCORD SERVER")
