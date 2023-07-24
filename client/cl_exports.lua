exports('takeServerImage', function(metadata)
  TriggerServerEvent('fivemanage:server:takeImage', metadata)
end)

RegisterCommand('takeImage', function()
  exports.fivemanage_lib:takeServerImage({
    playerId = "1",
    type = "player",
  })
end, false)