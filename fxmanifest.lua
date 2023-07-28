fx_version "cerulean"

game "gta5"

lua54 "yes"

author "Fivemanage"
description "FiveManage API SDK for FiveM"

shared_scripts {
  "shared/init.lua"
}

client_scripts {
  "client/cl_exports.lua",
}

server_scripts {
  "server/dist/index.js"
}
