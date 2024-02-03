Logger = {}

local api_url = "https://api.fivemanage.com/api/logs"

local function print_to_console(message, log_level, metadata, resource)
	local _log_level_color = log_level == "info" and "^2" or log_level == "warn" and "^3" or "^1"

	print(
		string.format(
			"%s[%s] %s^7: %s. [Metadata]: %s",
			_log_level_color,
			log_level:upper(),
			resource,
			message,
			json.encode(metadata)
		)
	)
end

---Sends an HTTP request to our backend. This is an internal function.
---@param data table The data to be sent as part of the HTTP request.
local function send_http_request(data)
	PerformHttpRequest(
		api_url,
		function(errorCode, resultData, resultHeaders, errorData)
			if errorCode ~= 200 then
				print(
					string.format(
						"^1Failed to send log to fivemanage. Error code: %s. Error data: %s",
						errorCode,
						errorData
					)
				)
				return
			end
		end,
		"POST",
		json.encode(data),
		{
			["Authorization"] = LOGS_API_KEY,
			["Content-Type"] = "application/json",
		}
	)
end

---@alias log_level "info" | "warn" | "error"

---@param log_level log_level The severity level of the log (e.g., "info", "warn", "error").
---@param message string The main content of the log message.
---@param metadata table Additional context or data associated with the log event.
function Process_Log_Request(log_level, message, metadata, resource)
	if type(log_level) ~= "string" or type(message) ~= "string" or (metadata ~= nil and type(metadata) ~= "table") then
		print("Malformed log data, skipping log...")
		return
	end

	local _log_level = string.lower(log_level)
	print_to_console(message, _log_level, metadata, resource)

	if _log_level ~= "info" and _log_level ~= "warn" and _log_level ~= "error" then
		print("Invalid log level, skipping log...")
		return
	end

	-- print out the log to the console in a beautiful and nice way for the user to see it when they are looking at their server consol

	if metadata and metadata.playerSource then
		if type(metadata.playerSource) == "string" then
			metadata._identifiers = Utils.getPlayerIdentifiers(metadata.playerSource)
		elseif type(metadata.playerSource) == "number" then
			metadata._identifiers = Utils.getPlayerIdentifiers(tostring(metadata.playerSource))
		else
			print("Player source is malformed, skipping identifiers retrieval...")
		end
	end

	local _metadata = metadata or {}
	_metadata._serverSessionId = SERVER_SESSION_ID

	-- might have to look into some batching later, in order to reduce the amount of requests sent to the backend
	-- for testing though, this should be fine

	if not LOGS_API_KEY then
		print("API key is not set, skipping log...")
		return
	end

	send_http_request({
		level = _log_level,
		message = message,
		resource = resource,
		metadata = _metadata,
	})
end

function Logger:Info(message, metadata)
	Process_Log_Request("info", message, metadata)
end

function Logger:Warn(message, metadata)
	Process_Log_Request("warn", message, metadata)
end

function Logger:Error(message, metadata)
	Process_Log_Request("error", message, metadata)
end

function Get_Logger_Instance()
	return Logger
end
