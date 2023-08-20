---@param logType logType @The log level.
---@param message string @The log message.
---@param options LogOptions @The log options.
exports("LogMessage", function(logType, message, options)
	Logs:LogMessage(logType, message, options)
end)

exports("GetLoggerInstance", function()
	return GetLoggerInstance()
end)
