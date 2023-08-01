local base_url = "https://api.fivemanage.com/analytics/player-event"

local player_identifiers = {}

local function send_event(event)
    -- TODO: save / resend event if failed or heartbeat is false

    PerformHttpRequest(base_url, function(status_code, response)
        if status_code ~= 200 then
            print("Failed to send player event.")
        else
            local data = json.decode(response)

            if not data.status or data.status ~= "success" then
                print("Failed to send player event.")
            else
                print("Player event sent.")
            end
        end
    end, "POST", json.encode(event), { ["Content-Type"] = "application/json", Authorization = API_KEY })
end

local function register_events()
    AddEventHandler("playerConnecting", function(name)
        local license = GetPlayerIdentifierByType(source, "license2")

        if not license then
            license = GetPlayerIdentifierByType(source, "license")

            if not license then
                print("Failed to get license for player connecting.")
                print(json.encode({ name = name, source = source }))
            end
        end

        license = string.gsub(license, "license2?:", "")

        send_event({
            eventType = "connecting",
            license = license,
            timestamp = os.time()
        })

        player_identifiers[source] = license
    end)

    AddEventHandler("playerJoining", function(tempSource)
        local license = player_identifiers[tonumber(tempSource)]

        if not license then
            print("Failed to get license for player joining.")
            print(json.encode({ name = GetPlayerName(source), source = source, tempSource = tempSource }))
        end

        send_event({
            eventType = "joining",
            license = license,
            timestamp = os.time()
        })

        player_identifiers[source] = license
        player_identifiers[tonumber(tempSource)] = nil
    end)

    -- TODO: do I care about the delay if someone disconnects while deferred?
    AddEventHandler("playerDropped", function(reason)
        local license = player_identifiers[source]

        if not license then
            print("Failed to get license for player dropped.")
            print(json.encode({ source = source, reason = reason }))
        end

        send_event({
            eventType = "dropped",
            license = license,
            timestamp = os.time()
        })

        player_identifiers[source] = nil
    end)
end

function Start_Player_Analytics()
    register_events()
end
