IS_SERVER = IsDuplicityVersion()
API_KEY = nil

-- TODO: dont crash, just save data and resend later

if IS_SERVER then
    math.randomseed(os.time())

    API_KEY = GetConvar("FIVEMANAGE_API_KEY", "")

    if API_KEY == "" then
        error("FIVEMANAGE_API_KEY is not set, please set it before starting this resource!")
    end
end

if GetResourceState("screenshot-basic") ~= "started" then
    error("screenshot-basic is not started, please start it before starting this resource!")
end
