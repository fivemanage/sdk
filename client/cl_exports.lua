RegisterCommand('takeImage', function()
  print("HELLO")
  TriggerServerEvent('fivemanage:server:takeImage', { color = "red", player = "player1" })
end, false)
