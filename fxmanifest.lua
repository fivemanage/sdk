fx_version "cerulean"

game "gta5"

lua54 "yes"

author "Fivemanage"
description "FiveManage API SDK for FiveM"

shared_scripts {
  "shared/init.lua",
  "shared/*.lua"
}

client_scripts {
  "client/cl_exports.lua",
}

server_scripts {
  "server/image/dist/index.js",
  "server/analytics/main.lua"
}
