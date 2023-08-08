exports("LogMessage", function(level, message, metadata)
	Logs:LogMessage(level, message, metadata)
end)

exports("LogInfo", function(message, metadata)
	Logs:LogInfo(message, metadata)
end)

exports("LogWarn", function(message, metadata)
	Logs:LogWarn(message, metadata)
end)

exports("LogError", function(message, metadata)
	Logs:LogError(message, metadata)
end)
