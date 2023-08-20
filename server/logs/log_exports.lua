exports("LogMessage", function(log_level, message, metadata)
	Process_Log_Request(log_level, message, metadata)
end)

exports("GetLoggerInstance", function()
	return Get_Logger_Instance()
end)
