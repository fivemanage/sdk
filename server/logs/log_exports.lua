exports("LogMessage", function(level, message, metadata)
	Logs:LogMessage(level, message, metadata)
end)

exports("GetLoggerInstance", function()
	return GetLoggerInstance()
end)
