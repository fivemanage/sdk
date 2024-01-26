IS_SERVER = IsDuplicityVersion()
LOGS_API_KEY = nil
MEDIA_API_KEY = nil

-- TODO: dont crash, just save data and resend later

if IS_SERVER then
    math.randomseed(os.time())

    MEDIA_API_KEY = GetConvar("FIVEMANAGE_MEDIA_API_KEY", "")
    LOGS_API_KEY = GetConvar("FIVEMANAGE_LOGS_API_KEY", "")

    if MEDIA_API_KEY == "" then
        error("FIVEMANAGE_MEDIA_API_KEY is not set, please set it before starting this resource!")
    end

    if LOGS_API_KEY == "" then
        error("FIVEMANAGE_LOGS_API_KEY is not set. Logs to Fivemanage will not work without this key.")
    end
end

if GetResourceState("screenshot-basic") ~= "started" then
    error("screenshot-basic is not started, please start it before starting this resource!")
end
