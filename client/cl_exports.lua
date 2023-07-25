local ImageRequestId = 0

exports("takeImage", function(metadata)
	local p = promise.new()
	TriggerServerEvent("fivemanage:server:takeImage", metadata, ImageRequestId)

	local eventHandler = RegisterNetEvent('fivemanage:client:receiveImageCallback:'..ImageRequestId, function(res)
		p:resolve(res)
	end)

	SetTimeout(10000, function()
		p:resolve(nil)
	end)

	local imageData = Citizen.Await(p)

	RemoveEventHandler(eventHandler)
	ImageRequestId = ImageRequestId + 1

	return imageData
end)
