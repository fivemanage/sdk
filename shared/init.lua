IS_SERVER = IsDuplicityVersion()
API_TOKEN = nil

if IS_SERVER then
    math.randomseed(os.time())

    API_TOKEN = GetConvar("FIVEMANAGE_IMAGE_TOKEN", "")

    if API_TOKEN == "" then
        error("FIVEMANAGE_IMAGE_TOKEN is not set, please set it before starting this resource!")
    end
end

if GetResourceState("screenshot-basic") ~= "started" then
    error("screenshot-basic is not started, please start it before starting this resource!")
end
