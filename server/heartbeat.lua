SERVER_SESSION_ID = Utils.generateUUID()

local base_url = string.format("https://api.fivemanage.com/heartbeat?sessionId=%s", SERVER_SESSION_ID)
local is_alive = false

local function request_heartbeat()
    PerformHttpRequest(base_url, function(status_code, response)
        if status_code ~= 200 then
            print("No heartbeat detected.")

            is_alive = false

            TriggerEvent("fivemanage:heartbeat", { is_alive = is_alive })
        else
            local data = json.decode(response)

            if not data.status or data.status ~= "success" then
                print("No heartbeat detected.")

                is_alive = false

                TriggerEvent("fivemanage:heartbeat", { is_alive = is_alive })
            else
                if not is_alive then
                    is_alive = true

                    print("Heartbeat detected. Server is alive!")
                end

                TriggerEvent("fivemanage:heartbeat", { is_alive = is_alive })
            end
        end

        SetTimeout(10000, request_heartbeat)
    end, "GET", "", { Authorization = API_KEY })
end

function Start_Heartbeat()
    request_heartbeat()
end
