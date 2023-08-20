Utils = {}

if IS_SERVER then
	---Retrieves player identifiers and returns them in a structured format.
	---@param player_source string
	---@return table: A table of identifiers in the format { [key: string]: string }
	function Utils.getPlayerIdentifiers(player_source)
		assert(type(player_source) == "string", "player source must be a string")

		local identifiers = GetPlayerIdentifiers(player_source)
		local data = {}

		for i = 1, #identifiers do
			local _, _, id_type, id = string.find(identifiers[i], "([^:]+):(.+)")

			data[id_type] = id
		end

		return data
	end
end

local timeoutCount = 0
local cancelledTimeouts = {}

--- Sets a timeout that will be called after the specified time.
--- @param cb function
--- @param delay number
--- @return number
function Utils.setTimeout(cb, delay)
	assert(type(cb) == "function", "cb must be a function")
	assert(type(delay) == "number", "delay must be a number")

	local timeoutId = timeoutCount + 1
	timeoutCount = timeoutId

	SetTimeout(delay, function()
		if not cancelledTimeouts[timeoutId] then
			cb()
		else
			cancelledTimeouts[timeoutId] = nil
		end
	end)

	return timeoutId
end

--- Cancels a timeout.
--- @param timeoutId number
function Utils.clearTimeout(timeoutId)
	assert(type(timeoutId) == "number", "timeoutId must be a number")

	cancelledTimeouts[timeoutId] = true
end

--- Creates a debounced function and a function to clear the timeout.
--- @param cb function
--- @param delay number
--- @param maxDelay number?
--- @return function, function
function Utils.debounce(cb, delay, maxDelay)
	assert(type(cb) == "function", "cb must be a function")
	assert(type(delay) == "number", "delay must be a number")

	if maxDelay then
		assert(type(maxDelay) == "number", "maxDelay must be a number")
	end

	local timerId = nil
	local maxTimerId = nil

	local function debounced(...)
		local args = { ... }

		if timerId then
			Utils.clearTimeout(timerId)
		end

		timerId = Utils.setTimeout(function()
			timerId = nil

			if maxTimerId then
				Utils.clearTimeout(maxTimerId)
				maxTimerId = nil
			end

			cb(table.unpack(args))
		end, delay)

		if maxDelay and not maxTimerId then
			maxTimerId = Utils.setTimeout(function()
				Utils.clearTimeout(timerId)

				timerId = nil
				maxTimerId = nil

				cb(table.unpack(args))
			end, maxDelay)
		end
	end

	local function clear()
		if timerId then
			Utils.clearTimeout(timerId)
		end

		if maxTimerId then
			Utils.clearTimeout(maxTimerId)
		end
	end

	return debounced, clear
end

--- Generates a UUID.
--- @return string
Utils.generateUUID = function()
	local template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"

	---@diagnostic disable-next-line: redundant-return-value
	return string.gsub(template, "[xy]", function(c)
		local v = (c == "x") and math.random(0, 0xf) or math.random(8, 0xb)
		return string.format("%x", v)
	end)
end
