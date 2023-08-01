local callback_id = 0

exports("takeImage", function(metadata)
	local p = promise.new()

	TriggerServerEvent("fivemanage:takeImage", metadata, callback_id)

	local handler_id = RegisterNetEvent('fivemanage:receiveImageCallback:' .. callback_id, function(res)
		p:resolve(res)
	end)

	SetTimeout(10000, function()
		p:resolve(nil)
	end)

	local image_data = Citizen.Await(p)

	if handler_id then
		RemoveEventHandler(handler_id)
	end

	callback_id = callback_id + 1

	return image_data
end)
