fx_version "cerulean"

lua54 "yes"

game "gta5"

shared_scripts {
	"shared/init.lua",
	"shared/utils.lua",
}

client_scripts {
	"client/image.lua",
}

server_scripts {
	"server/heartbeat.lua",
	"server/analytics/start.lua",
	"server/analytics/player.lua",
	"server/logs/*.lua",
	"server/main.lua",

	"server/dist/index.js",
}