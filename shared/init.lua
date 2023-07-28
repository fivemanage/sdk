if GetResourceState("screenshot-basic") ~= "started" then
    error("screenshot-basic is not started, please start it before starting this resource!")
end
